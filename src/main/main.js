/**
 * NeuroInsight Desktop - Main Process
 * Handles app lifecycle, window management, and backend services
 */

const { app, BrowserWindow, ipcMain, dialog, shell, Menu, Tray } = require('electron');
const path = require('path');
const log = require('electron-log');
const Store = require('electron-store');

const DockerManager = require('./docker-manager');
const BackendServer = require('./backend-server');
const { checkSystemRequirements } = require('./system-check');

// Configure logging
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

// Initialize store for app settings
const store = new Store({
  defaults: {
    windowBounds: { width: 1400, height: 900 },
    dockerInstalled: false,
    firstRun: true,
    theme: 'light'
  }
});

let mainWindow = null;
let tray = null;
let backendServer = null;
let dockerManager = null;

/**
 * Create the main application window
 */
function createWindow() {
  const bounds = store.get('windowBounds');

  mainWindow = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, '../../build/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#ffffff',
    show: false, // Don't show until ready
    title: 'NeuroInsight'
  });

  // Load the frontend
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../frontend/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    log.info('Main window shown');
  });

  // Save window bounds on resize/move
  mainWindow.on('resize', () => {
    store.set('windowBounds', mainWindow.getBounds());
  });

  mainWindow.on('move', () => {
    store.set('windowBounds', mainWindow.getBounds());
  });

  // Handle window close
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      
      if (tray) {
        tray.displayBalloon({
          title: 'NeuroInsight',
          content: 'App is still running in the background'
        });
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();

  log.info('Main window created');
}

/**
 * Create application menu
 */
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Job',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu:new-job')
        },
        {
          label: 'Open MRI File...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'MRI Files', extensions: ['nii', 'gz', 'dcm'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send('file:open', result.filePaths[0]);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow.webContents.send('menu:settings')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Docker',
      submenu: [
        {
          label: 'Check Status',
          click: async () => {
            const status = await dockerManager.checkStatus();
            mainWindow.webContents.send('docker:status', status);
          }
        },
        {
          label: 'Install Docker Desktop',
          click: () => {
            shell.openExternal('https://www.docker.com/products/docker-desktop/');
          }
        },
        { type: 'separator' },
        {
          label: 'View Docker Logs',
          click: () => mainWindow.webContents.send('menu:docker-logs')
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://github.com/neuroinsight/docs')
        },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/neuroinsight/issues')
        },
        { type: 'separator' },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About NeuroInsight',
              message: 'NeuroInsight v1.0.0',
              detail: 'Automated MRI Brain Analysis\n\nCopyright © 2024 NeuroInsight Team'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Create system tray icon
 */
function createTray() {
  const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, '../../build/icon.ico')
    : path.join(__dirname, '../../build/icon.png');

  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show NeuroInsight',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Backend Status',
      click: async () => {
        const status = await backendServer.getStatus();
        dialog.showMessageBox({
          type: 'info',
          title: 'Backend Status',
          message: status.running ? 'Backend is running' : 'Backend is stopped',
          detail: `Port: ${status.port}\nUptime: ${status.uptime}`
        });
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('NeuroInsight');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  });
}

/**
 * Initialize the application
 */
async function initialize() {
  log.info('Initializing NeuroInsight...');

  // Check system requirements
  const sysCheck = await checkSystemRequirements();
  log.info('System check:', sysCheck);

  // Initialize Docker manager
  dockerManager = new DockerManager();
  const dockerStatus = await dockerManager.checkStatus();
  store.set('dockerInstalled', dockerStatus.installed);

  if (!dockerStatus.installed) {
    log.warn('Docker not installed');
    const result = await dialog.showMessageBox({
      type: 'warning',
      title: 'Docker Required',
      message: 'NeuroInsight requires Docker Desktop for FreeSurfer processing.',
      detail: 'Would you like to download Docker Desktop now?',
      buttons: ['Download Docker', 'Continue Anyway', 'Exit'],
      defaultId: 0,
      cancelId: 2
    });

    if (result.response === 0) {
      shell.openExternal('https://www.docker.com/products/docker-desktop/');
      await dialog.showMessageBox({
        type: 'info',
        title: 'Installation Required',
        message: 'Please install Docker Desktop and restart NeuroInsight.',
        buttons: ['OK']
      });
      app.quit();
      return;
    } else if (result.response === 2) {
      app.quit();
      return;
    }
  } else {
    log.info('Docker is available');
  }

  // Start backend server
  backendServer = new BackendServer();
  const serverStarted = await backendServer.start();

  if (!serverStarted) {
    log.error('Failed to start backend server');
    dialog.showErrorBox(
      'Backend Error',
      'Failed to start the backend server. Please check the logs.'
    );
    app.quit();
    return;
  }

  log.info(`Backend server started on port ${backendServer.port}`);

  // Create window
  createWindow();

  // Create tray icon
  createTray();

  // First run experience
  if (store.get('firstRun')) {
    setTimeout(() => {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Welcome to NeuroInsight',
        message: 'Thank you for installing NeuroInsight!',
        detail: 'This app uses Docker to run FreeSurfer for MRI brain analysis.\n\n' +
                'On your first job, the FreeSurfer image (~7GB) will be downloaded automatically.\n\n' +
                'Processing typically takes 3-7 hours per scan.',
        buttons: ['Get Started']
      });
      store.set('firstRun', false);
    }, 1000);
  }
}

/**
 * App lifecycle handlers
 */
app.whenReady().then(initialize);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on('before-quit', async () => {
  log.info('App is quitting, cleaning up...');
  
  if (backendServer) {
    await backendServer.stop();
  }
  
  if (tray) {
    tray.destroy();
  }
});

/**
 * IPC Handlers
 */

// Docker operations
ipcMain.handle('docker:check', async () => {
  return await dockerManager.checkStatus();
});

ipcMain.handle('docker:pull-image', async (event, imageName) => {
  return await dockerManager.pullImage(imageName);
});

// Backend operations
ipcMain.handle('backend:status', async () => {
  return await backendServer.getStatus();
});

ipcMain.handle('backend:url', () => {
  return backendServer.getUrl();
});

// File operations
ipcMain.handle('file:select', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'MRI Files', extensions: ['nii', 'gz', 'dcm'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('folder:select', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// App info
ipcMain.handle('app:version', () => {
  return app.getVersion();
});

ipcMain.handle('app:platform', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version
  };
});

// Store operations
ipcMain.handle('store:get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('store:set', (event, key, value) => {
  store.set(key, value);
});

// External links
ipcMain.handle('open:external', (event, url) => {
  shell.openExternal(url);
});

// Logging
ipcMain.on('log:info', (event, message) => {
  log.info('[Renderer]', message);
});

ipcMain.on('log:error', (event, message) => {
  log.error('[Renderer]', message);
});

// Error handling
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error);
  dialog.showErrorBox('Unexpected Error', error.message);
});

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled rejection:', reason);
});
