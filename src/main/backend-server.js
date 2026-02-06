/**
 * Backend Server Manager
 * Manages the Python FastAPI backend server
 */

const { spawn } = require('child_process');
const { promisify } = require('util');
const { exec } = require('child_process');
const log = require('electron-log');
const axios = require('axios');
const path = require('path');

const execAsync = promisify(exec);

class BackendServer {
  constructor() {
    this.process = null;
    this.port = 8000;
    this.baseUrl = `http://localhost:${this.port}`;
    this.startTime = null;
  }

  /**
   * Start the backend server
   */
  async start() {
    try {
      // Check if port is available
      const portAvailable = await this.isPortAvailable(this.port);
      
      if (!portAvailable) {
        log.warn(`Port ${this.port} is in use, trying to find alternative...`);
        this.port = await this.findAvailablePort(8000, 8050);
        this.baseUrl = `http://localhost:${this.port}`;
        log.info(`Using port ${this.port}`);
      }

      // Start the backend using Docker
      return await this.startDockerBackend();
    } catch (error) {
      log.error('Failed to start backend:', error);
      return false;
    }
  }

  /**
   * Start backend using Docker (same as Docker deployment)
   */
  async startDockerBackend() {
    try {
      const DockerManager = require('./docker-manager');
      const dockerManager = new DockerManager();

      // Check if container already exists
      try {
        const { stdout } = await execAsync('docker ps -a --filter name=neuroinsight --format "{{.Names}}"');
        if (stdout.trim() === 'neuroinsight') {
          log.info('NeuroInsight container already exists, starting it...');
          await execAsync('docker start neuroinsight');
          this.startTime = Date.now();
          
          // Wait for backend to be ready
          await this.waitForBackend();
          return true;
        }
      } catch (e) {
        // Container doesn't exist, create it
      }

      // Pull the NeuroInsight image if needed
      const imageName = 'phindagijimana321/neuroinsight:latest';
      const imageExists = await dockerManager.imageExists(imageName);

      if (!imageExists) {
        log.info('Pulling NeuroInsight image...');
        await dockerManager.pullImage(imageName, (progress) => {
          log.info('Pull progress:', progress.data);
        });
      }

      // Get user's data directory
      const dataDir = this.getDataDirectory();
      log.info('Data directory:', dataDir);

      // Create volume if not exists
      try {
        await execAsync('docker volume create neuroinsight-data');
      } catch (e) {
        // Volume might already exist
      }

      // Start container
      log.info('Starting NeuroInsight container...');
      const result = await dockerManager.runContainer({
        image: imageName,
        name: 'neuroinsight',
        ports: [`${this.port}:8000`, '9000:9000', '9001:9001'],
        volumes: [
          '/var/run/docker.sock:/var/run/docker.sock',
          'neuroinsight-data:/data'
        ],
        environment: {
          'HOST_UPLOAD_DIR': '/var/lib/docker/volumes/neuroinsight-data/_data/uploads',
          'HOST_OUTPUT_DIR': '/var/lib/docker/volumes/neuroinsight-data/_data/outputs'
        },
        removeOnExit: false,
        detached: true
      });

      if (result.success) {
        log.info('Container started successfully');
        this.startTime = Date.now();
        
        // Wait for backend to be ready
        await this.waitForBackend();
        return true;
      }

      return false;
    } catch (error) {
      log.error('Failed to start Docker backend:', error);
      return false;
    }
  }

  /**
   * Wait for backend to become ready
   */
  async waitForBackend(maxAttempts = 30) {
    log.info('Waiting for backend to be ready...');
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/health`, {
          timeout: 2000
        });
        
        if (response.status === 200) {
          log.info('Backend is ready!');
          return true;
        }
      } catch (error) {
        // Backend not ready yet
        log.debug(`Attempt ${i + 1}/${maxAttempts}: Backend not ready`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    log.error('Backend failed to become ready');
    return false;
  }

  /**
   * Stop the backend server
   */
  async stop() {
    try {
      log.info('Stopping backend server...');
      
      // Stop Docker container
      await execAsync('docker stop neuroinsight');
      
      this.startTime = null;
      log.info('Backend stopped');
      return true;
    } catch (error) {
      log.error('Failed to stop backend:', error);
      return false;
    }
  }

  /**
   * Get backend status
   */
  async getStatus() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/health`, {
        timeout: 2000
      });
      
      const uptime = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
      
      return {
        running: true,
        port: this.port,
        url: this.baseUrl,
        uptime: uptime,
        health: response.data
      };
    } catch (error) {
      return {
        running: false,
        port: this.port,
        url: this.baseUrl,
        uptime: 0,
        error: error.message
      };
    }
  }

  /**
   * Get backend URL
   */
  getUrl() {
    return this.baseUrl;
  }

  /**
   * Check if port is available
   */
  async isPortAvailable(port) {
    try {
      await axios.get(`http://localhost:${port}`, { timeout: 1000 });
      return false; // Port is in use
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        return true; // Port is available
      }
      return false;
    }
  }

  /**
   * Find an available port in range
   */
  async findAvailablePort(start, end) {
    for (let port = start; port <= end; port++) {
      if (await this.isPortAvailable(port)) {
        return port;
      }
    }
    throw new Error(`No available ports found in range ${start}-${end}`);
  }

  /**
   * Get data directory path
   */
  getDataDirectory() {
    const { app } = require('electron');
    return path.join(app.getPath('userData'), 'data');
  }
}

module.exports = BackendServer;
