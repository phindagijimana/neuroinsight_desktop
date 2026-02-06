/**
 * NeuroInsight Desktop - Frontend Application
 */

// State management
const state = {
  currentView: 'welcome',
  backendUrl: null,
  dockerStatus: null,
  selectedFile: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  console.log('App initializing...');
  
  // Get backend URL
  state.backendUrl = await window.electron.backend.getUrl();
  console.log('Backend URL:', state.backendUrl);
  
  // Check backend status
  updateBackendStatus();
  setInterval(updateBackendStatus, 5000);
  
  // Check Docker status
  checkDockerStatus();
  
  // Check system requirements
  checkSystemRequirements();
  
  // Get app info
  updateAppInfo();
  
  // Set up event listeners
  setupEventListeners();
  
  // Setup menu handlers
  setupMenuHandlers();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Welcome screen
  document.getElementById('new-job-btn').addEventListener('click', () => {
    showView('new-job');
  });
  
  document.getElementById('view-jobs-btn').addEventListener('click', () => {
    showView('jobs');
    loadJobs();
  });
  
  // Navigation
  document.getElementById('back-btn').addEventListener('click', () => {
    showView('welcome');
  });
  
  document.getElementById('cancel-btn').addEventListener('click', () => {
    showView('welcome');
  });
  
  document.getElementById('close-settings-btn').addEventListener('click', () => {
    showView('welcome');
  });
  
  // Settings
  document.getElementById('settings-btn').addEventListener('click', () => {
    showView('settings');
    loadSettings();
  });
  
  document.getElementById('docker-status-btn').addEventListener('click', checkDockerStatus);
  
  // Settings actions
  document.getElementById('check-docker-btn').addEventListener('click', checkDockerStatus);
  
  document.getElementById('install-docker-btn').addEventListener('click', () => {
    window.electron.openExternal('https://www.docker.com/products/docker-desktop/');
  });
  
  document.getElementById('pull-freesurfer-btn').addEventListener('click', pullFreeSurferImage);
  
  // File selection
  document.getElementById('select-file-btn').addEventListener('click', selectFile);
  
  document.getElementById('start-analysis-btn').addEventListener('click', startAnalysis);
  
  // Drag and drop
  const dropZone = document.getElementById('drop-zone');
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0].path);
    }
  });
}

/**
 * Setup menu handlers
 */
function setupMenuHandlers() {
  window.electron.menu.onNewJob(() => {
    showView('new-job');
  });
  
  window.electron.menu.onSettings(() => {
    showView('settings');
    loadSettings();
  });
  
  window.electron.file.onOpen((filePath) => {
    handleFileSelection(filePath);
  });
}

/**
 * Show view
 */
function showView(viewName) {
  // Hide all views
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('jobs-view').style.display = 'none';
  document.getElementById('new-job-view').style.display = 'none';
  document.getElementById('settings-view').style.display = 'none';
  
  // Show selected view
  if (viewName === 'welcome') {
    document.getElementById('welcome-screen').style.display = 'flex';
  } else if (viewName === 'jobs') {
    document.getElementById('jobs-view').style.display = 'block';
  } else if (viewName === 'new-job') {
    document.getElementById('new-job-view').style.display = 'block';
  } else if (viewName === 'settings') {
    document.getElementById('settings-view').style.display = 'block';
  }
  
  state.currentView = viewName;
}

/**
 * Update backend status
 */
async function updateBackendStatus() {
  try {
    const status = await window.electron.backend.getStatus();
    const statusElement = document.getElementById('backend-status');
    
    if (status.running) {
      statusElement.textContent = `[OK] Running on port ${status.port}`;
      statusElement.style.color = 'var(--success-color)';
    } else {
      statusElement.textContent = '[!] Not running';
      statusElement.style.color = 'var(--error-color)';
    }
  } catch (error) {
    console.error('Failed to get backend status:', error);
    document.getElementById('backend-status').textContent = '[WARNING] Error';
  }
}

/**
 * Check Docker status
 */
async function checkDockerStatus() {
  try {
    showToast('Checking Docker...', 'info');
    
    const status = await window.electron.docker.checkStatus();
    state.dockerStatus = status;
    
    console.log('Docker status:', status);
    
    const statusIcon = document.getElementById('docker-status-icon');
    const statusText = document.getElementById('docker-status-text');
    
    if (status.running) {
      statusIcon.textContent = '[OK]';
      if (statusText) statusText.textContent = `[OK] Running (${status.version})`;
      showToast('Docker is running', 'success');
    } else if (status.installed) {
      statusIcon.textContent = '[!]';
      if (statusText) statusText.textContent = `[!] Installed but not running`;
      showToast('Docker is installed but not running. Please start Docker Desktop.', 'warning');
    } else {
      statusIcon.textContent = '[X]';
      if (statusText) statusText.textContent = '[X] Not installed';
      showToast('Docker is not installed', 'error');
    }
    
    // Update system checks
    updateSystemChecks();
  } catch (error) {
    console.error('Failed to check Docker:', error);
    showToast('Failed to check Docker status', 'error');
  }
}

/**
 * Check system requirements
 */
async function checkSystemRequirements() {
  try {
    const platform = await window.electron.app.platform();
    console.log('Platform:', platform);
    
    updateSystemChecks();
  } catch (error) {
    console.error('Failed to check system requirements:', error);
  }
}

/**
 * Update system checks display
 */
function updateSystemChecks() {
  const checksContainer = document.getElementById('system-checks');
  
  if (!state.dockerStatus) {
    checksContainer.innerHTML = '<div class="status-item"><span class="status-icon">⏳</span><span>Checking...</span></div>';
    return;
  }
  
  let checks = '';
  
  if (state.dockerStatus.running) {
    checks += '<div class="status-item"><span class="status-icon">[OK]</span><span>Docker: Running</span></div>';
  } else if (state.dockerStatus.installed) {
    checks += '<div class="status-item"><span class="status-icon">[!]</span><span>Docker: Not running (please start Docker Desktop)</span></div>';
  } else {
    checks += '<div class="status-item"><span class="status-icon">[X]</span><span>Docker: Not installed</span></div>';
  }
  
  checksContainer.innerHTML = checks;
}

/**
 * Update app info
 */
async function updateAppInfo() {
  try {
    const version = await window.electron.app.version();
    const platform = await window.electron.app.platform();
    
    const versionElement = document.getElementById('app-version');
    const platformElement = document.getElementById('app-platform');
    
    if (versionElement) versionElement.textContent = version;
    if (platformElement) platformElement.textContent = `${platform.platform} (${platform.arch})`;
  } catch (error) {
    console.error('Failed to get app info:', error);
  }
}

/**
 * Load settings
 */
async function loadSettings() {
  checkDockerStatus();
  
  // Check FreeSurfer image
  document.getElementById('freesurfer-status').textContent = 'Checking...';
  
  // This would require backend API call
  setTimeout(() => {
    document.getElementById('freesurfer-status').textContent = 'Ready';
  }, 1000);
}

/**
 * Pull FreeSurfer image
 */
async function pullFreeSurferImage() {
  try {
    showToast('Downloading FreeSurfer image... This may take 10-30 minutes.', 'info');
    
    const result = await window.electron.docker.pullImage('freesurfer/freesurfer:7.4.1');
    
    if (result.success) {
      showToast('FreeSurfer image downloaded successfully', 'success');
      document.getElementById('freesurfer-status').textContent = '[OK] Downloaded';
    } else {
      showToast('Failed to download FreeSurfer image', 'error');
    }
  } catch (error) {
    console.error('Failed to pull FreeSurfer:', error);
    showToast('Error downloading FreeSurfer image', 'error');
  }
}

/**
 * Select file
 */
async function selectFile() {
  try {
    const filePath = await window.electron.file.select();
    
    if (filePath) {
      handleFileSelection(filePath);
    }
  } catch (error) {
    console.error('Failed to select file:', error);
    showToast('Failed to select file', 'error');
  }
}

/**
 * Handle file selection
 */
function handleFileSelection(filePath) {
  state.selectedFile = filePath;
  
  document.getElementById('file-path').textContent = filePath;
  document.getElementById('file-info').style.display = 'block';
  
  showToast('File selected', 'success');
}

/**
 * Start analysis
 */
async function startAnalysis() {
  if (!state.selectedFile) {
    showToast('Please select a file first', 'warning');
    return;
  }
  
  if (!state.dockerStatus || !state.dockerStatus.running) {
    showToast('Docker is not running. Please start Docker Desktop first.', 'error');
    return;
  }
  
  try {
    showToast('Starting analysis... This will take several hours.', 'info');
    
    // This would call the backend API to create a new job
    console.log('Starting analysis for:', state.selectedFile);
    
    // For now, just show a message
    setTimeout(() => {
      showToast('Analysis started successfully', 'success');
      showView('jobs');
      loadJobs();
    }, 1000);
  } catch (error) {
    console.error('Failed to start analysis:', error);
    showToast('Failed to start analysis', 'error');
  }
}

/**
 * Load jobs
 */
async function loadJobs() {
  const jobsList = document.getElementById('jobs-list');
  jobsList.innerHTML = '<div class="loading">Loading jobs...</div>';
  
  // This would fetch jobs from the backend API
  setTimeout(() => {
    jobsList.innerHTML = '<p>No jobs yet. Create your first analysis!</p>';
  }, 1000);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse';
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 4000);
  
  // Log to Electron
  window.electron.log.info(`Toast: [${type}] ${message}`);
}

// Make showToast globally available
window.showToast = showToast;
