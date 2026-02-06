/**
 * System Requirements Checker
 */

const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');
const log = require('electron-log');

const execAsync = promisify(exec);

/**
 * Check system requirements
 */
async function checkSystemRequirements() {
  const results = {
    platform: process.platform,
    arch: process.arch,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpuCount: os.cpus().length,
    cpuModel: os.cpus()[0]?.model || 'Unknown',
    osVersion: os.release(),
    requirements: {
      memoryOk: false,
      cpuOk: false,
      diskSpaceOk: false,
      dockerOk: false
    },
    warnings: [],
    errors: []
  };

  // Check memory (minimum 8GB recommended)
  const memoryGB = results.totalMemory / (1024 ** 3);
  results.requirements.memoryOk = memoryGB >= 8;
  
  if (memoryGB < 8) {
    results.warnings.push(`Low memory: ${memoryGB.toFixed(1)}GB (8GB+ recommended)`);
  } else if (memoryGB < 16) {
    results.warnings.push(`Adequate memory: ${memoryGB.toFixed(1)}GB (16GB+ recommended for best performance)`);
  }

  // Check CPU (minimum 4 cores recommended)
  results.requirements.cpuOk = results.cpuCount >= 4;
  
  if (results.cpuCount < 4) {
    results.warnings.push(`Low CPU count: ${results.cpuCount} cores (4+ recommended)`);
  }

  // Check disk space
  try {
    const diskSpace = await checkDiskSpace();
    results.diskSpace = diskSpace;
    results.requirements.diskSpaceOk = diskSpace.free > 50 * 1024 ** 3; // 50GB
    
    if (!results.requirements.diskSpaceOk) {
      results.warnings.push(`Low disk space: ${(diskSpace.free / 1024 ** 3).toFixed(1)}GB free (50GB+ recommended)`);
    }
  } catch (error) {
    log.warn('Failed to check disk space:', error);
    results.warnings.push('Could not verify disk space');
  }

  // Check Docker
  try {
    await execAsync('docker --version');
    results.requirements.dockerOk = true;
  } catch (error) {
    results.requirements.dockerOk = false;
    results.errors.push('Docker is not installed or not in PATH');
  }

  // Platform-specific checks
  if (process.platform === 'win32') {
    await checkWindowsRequirements(results);
  } else if (process.platform === 'linux') {
    await checkLinuxRequirements(results);
  } else if (process.platform === 'darwin') {
    await checkMacRequirements(results);
  }

  // Overall status
  const allOk = Object.values(results.requirements).every(v => v === true);
  results.status = allOk ? 'ready' : (results.errors.length > 0 ? 'error' : 'warning');

  return results;
}

/**
 * Check disk space
 */
async function checkDiskSpace() {
  if (process.platform === 'win32') {
    // Windows
    try {
      const { stdout } = await execAsync('wmic logicaldisk get size,freespace,caption');
      const lines = stdout.trim().split('\n').slice(1);
      const cDrive = lines.find(line => line.includes('C:'));
      
      if (cDrive) {
        const [, free, total] = cDrive.trim().split(/\s+/);
        return {
          total: parseInt(total),
          free: parseInt(free),
          used: parseInt(total) - parseInt(free)
        };
      }
    } catch (error) {
      log.error('Failed to check Windows disk space:', error);
    }
  } else {
    // Linux/Mac
    try {
      const { stdout } = await execAsync('df -k /');
      const lines = stdout.trim().split('\n');
      const data = lines[1].split(/\s+/);
      
      return {
        total: parseInt(data[1]) * 1024,
        used: parseInt(data[2]) * 1024,
        free: parseInt(data[3]) * 1024
      };
    } catch (error) {
      log.error('Failed to check disk space:', error);
    }
  }

  return { total: 0, free: 0, used: 0 };
}

/**
 * Windows-specific checks
 */
async function checkWindowsRequirements(results) {
  // Check WSL2
  try {
    const { stdout } = await execAsync('wsl --list --verbose');
    results.wsl2 = {
      installed: true,
      output: stdout
    };
  } catch (error) {
    results.wsl2 = { installed: false };
    results.warnings.push('WSL2 not detected (required for Docker Desktop)');
  }

  // Check Hyper-V (for older Windows versions)
  try {
    const { stdout } = await execAsync('powershell "Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All"');
    if (stdout.includes('Enabled')) {
      results.hyperv = { enabled: true };
    }
  } catch (error) {
    log.debug('Hyper-V check failed:', error);
  }
}

/**
 * Linux-specific checks
 */
async function checkLinuxRequirements(results) {
  // Check if Docker is in docker group
  try {
    const { stdout } = await execAsync('groups');
    results.dockerGroup = stdout.includes('docker');
    
    if (!results.dockerGroup) {
      results.warnings.push('Current user not in docker group (may need sudo for Docker commands)');
    }
  } catch (error) {
    log.debug('Docker group check failed:', error);
  }

  // Check for Apptainer/Singularity (alternative to Docker)
  try {
    await execAsync('apptainer --version');
    results.apptainer = { installed: true };
  } catch (error) {
    try {
      await execAsync('singularity --version');
      results.singularity = { installed: true };
    } catch (e) {
      // Neither available
    }
  }
}

/**
 * macOS-specific checks
 */
async function checkMacRequirements(results) {
  // Check macOS version
  try {
    const { stdout } = await execAsync('sw_vers -productVersion');
    results.macVersion = stdout.trim();
    
    const [major, minor] = results.macVersion.split('.').map(Number);
    if (major < 11) {
      results.warnings.push(`macOS ${results.macVersion} detected (macOS 11+ recommended for Docker Desktop)`);
    }
  } catch (error) {
    log.debug('macOS version check failed:', error);
  }
}

module.exports = {
  checkSystemRequirements,
  checkDiskSpace
};
