/**
 * NeuroInsight Desktop - Preload Script
 * Exposes safe APIs to the renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Docker operations
  docker: {
    checkStatus: () => ipcRenderer.invoke('docker:check'),
    pullImage: (imageName) => ipcRenderer.invoke('docker:pull-image', imageName),
    onStatusUpdate: (callback) => {
      ipcRenderer.on('docker:status', (event, status) => callback(status));
    }
  },

  // Backend operations
  backend: {
    getStatus: () => ipcRenderer.invoke('backend:status'),
    getUrl: () => ipcRenderer.invoke('backend:url')
  },

  // File operations
  file: {
    select: () => ipcRenderer.invoke('file:select'),
    onOpen: (callback) => {
      ipcRenderer.on('file:open', (event, filePath) => callback(filePath));
    }
  },

  folder: {
    select: () => ipcRenderer.invoke('folder:select')
  },

  // App info
  app: {
    version: () => ipcRenderer.invoke('app:version'),
    platform: () => ipcRenderer.invoke('app:platform')
  },

  // Store operations
  store: {
    get: (key) => ipcRenderer.invoke('store:get', key),
    set: (key, value) => ipcRenderer.invoke('store:set', key, value)
  },

  // Menu operations
  menu: {
    onNewJob: (callback) => {
      ipcRenderer.on('menu:new-job', callback);
    },
    onSettings: (callback) => {
      ipcRenderer.on('menu:settings', callback);
    },
    onDockerLogs: (callback) => {
      ipcRenderer.on('menu:docker-logs', callback);
    }
  },

  // External links
  openExternal: (url) => ipcRenderer.invoke('open:external', url),

  // Logging
  log: {
    info: (message) => ipcRenderer.send('log:info', message),
    error: (message) => ipcRenderer.send('log:error', message)
  }
});

// Log preload script loaded
console.log('Preload script loaded successfully');
