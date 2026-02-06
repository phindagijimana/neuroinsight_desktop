/**
 * Docker Manager - Handle Docker operations
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const log = require('electron-log');
const os = require('os');

const execAsync = promisify(exec);

class DockerManager {
  constructor() {
    this.platform = os.platform();
    this.dockerCommand = 'docker';
  }

  /**
   * Check if Docker is installed and running
   */
  async checkStatus() {
    try {
      // Check if Docker is installed
      const { stdout: versionOutput } = await execAsync(`${this.dockerCommand} --version`);
      const version = versionOutput.trim();

      // Check if Docker daemon is running
      try {
        await execAsync(`${this.dockerCommand} ps`);
        
        return {
          installed: true,
          running: true,
          version: version,
          platform: this.platform
        };
      } catch (daemonError) {
        return {
          installed: true,
          running: false,
          version: version,
          platform: this.platform,
          error: 'Docker daemon is not running'
        };
      }
    } catch (error) {
      log.warn('Docker not found:', error.message);
      return {
        installed: false,
        running: false,
        version: null,
        platform: this.platform,
        error: 'Docker is not installed'
      };
    }
  }

  /**
   * Pull a Docker image
   */
  async pullImage(imageName, onProgress) {
    return new Promise((resolve, reject) => {
      const child = exec(`${this.dockerCommand} pull ${imageName}`);

      let output = '';

      child.stdout.on('data', (data) => {
        output += data;
        log.info(`[Docker Pull] ${data}`);
        
        if (onProgress) {
          onProgress({ type: 'stdout', data: data.toString() });
        }
      });

      child.stderr.on('data', (data) => {
        log.warn(`[Docker Pull Error] ${data}`);
        
        if (onProgress) {
          onProgress({ type: 'stderr', data: data.toString() });
        }
      });

      child.on('close', (code) => {
        if (code === 0) {
          log.info(`Successfully pulled image: ${imageName}`);
          resolve({ success: true, output });
        } else {
          log.error(`Failed to pull image: ${imageName}, exit code: ${code}`);
          reject(new Error(`Docker pull failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        log.error('Docker pull error:', error);
        reject(error);
      });
    });
  }

  /**
   * Run a Docker container
   */
  async runContainer(options) {
    const {
      image,
      name,
      volumes = [],
      environment = {},
      ports = [],
      removeOnExit = false,
      detached = true
    } = options;

    let command = `${this.dockerCommand} run`;

    if (detached) command += ' -d';
    if (removeOnExit) command += ' --rm';
    if (name) command += ` --name ${name}`;

    // Add volumes
    for (const volume of volumes) {
      command += ` -v ${volume}`;
    }

    // Add environment variables
    for (const [key, value] of Object.entries(environment)) {
      command += ` -e ${key}=${value}`;
    }

    // Add port mappings
    for (const port of ports) {
      command += ` -p ${port}`;
    }

    command += ` ${image}`;

    log.info('Running Docker container:', command);

    try {
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        log.warn('Docker run stderr:', stderr);
      }

      const containerId = stdout.trim();
      log.info('Container started:', containerId);

      return {
        success: true,
        containerId,
        output: stdout
      };
    } catch (error) {
      log.error('Failed to run container:', error);
      throw error;
    }
  }

  /**
   * Stop a Docker container
   */
  async stopContainer(containerIdOrName) {
    try {
      await execAsync(`${this.dockerCommand} stop ${containerIdOrName}`);
      log.info('Container stopped:', containerIdOrName);
      return { success: true };
    } catch (error) {
      log.error('Failed to stop container:', error);
      throw error;
    }
  }

  /**
   * Remove a Docker container
   */
  async removeContainer(containerIdOrName) {
    try {
      await execAsync(`${this.dockerCommand} rm ${containerIdOrName}`);
      log.info('Container removed:', containerIdOrName);
      return { success: true };
    } catch (error) {
      log.error('Failed to remove container:', error);
      throw error;
    }
  }

  /**
   * List Docker images
   */
  async listImages() {
    try {
      const { stdout } = await execAsync(`${this.dockerCommand} images --format "{{json .}}"`);
      const lines = stdout.trim().split('\n').filter(line => line);
      const images = lines.map(line => JSON.parse(line));
      return images;
    } catch (error) {
      log.error('Failed to list images:', error);
      throw error;
    }
  }

  /**
   * Check if a Docker image exists locally
   */
  async imageExists(imageName) {
    try {
      await execAsync(`${this.dockerCommand} image inspect ${imageName}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get Docker container logs
   */
  async getLogs(containerIdOrName, tail = 100) {
    try {
      const { stdout } = await execAsync(
        `${this.dockerCommand} logs --tail ${tail} ${containerIdOrName}`
      );
      return stdout;
    } catch (error) {
      log.error('Failed to get logs:', error);
      throw error;
    }
  }

  /**
   * Execute command in running container
   */
  async exec(containerIdOrName, command) {
    try {
      const { stdout, stderr } = await execAsync(
        `${this.dockerCommand} exec ${containerIdOrName} ${command}`
      );
      return { stdout, stderr };
    } catch (error) {
      log.error('Failed to exec command:', error);
      throw error;
    }
  }

  /**
   * Get FreeSurfer image name based on platform
   */
  getFreeSurferImage() {
    // Same image for all platforms (Linux container via Docker Desktop)
    return 'freesurfer/freesurfer:7.4.1';
  }

  /**
   * Check if FreeSurfer image is available
   */
  async checkFreeSurferImage() {
    const imageName = this.getFreeSurferImage();
    const exists = await this.imageExists(imageName);
    
    if (!exists) {
      log.warn('FreeSurfer image not found locally');
      return {
        available: false,
        imageName,
        needsDownload: true
      };
    }

    return {
      available: true,
      imageName,
      needsDownload: false
    };
  }

  /**
   * Pull FreeSurfer image with progress
   */
  async pullFreeSurferImage(onProgress) {
    const imageName = this.getFreeSurferImage();
    log.info('Pulling FreeSurfer image:', imageName);
    return await this.pullImage(imageName, onProgress);
  }
}

module.exports = DockerManager;
