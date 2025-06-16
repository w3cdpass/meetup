require('dotenv').config(); // Load .env files
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false,
            nodeIntegrationInSubFrames : false
        }
    });

    const { ipcMain } = require('electron');
  ipcMain.on('greeting', (event, message) => {
    console.log('Received from React:', message);
    event.sender.send('message', 'Hello back from Electron!');
  });

    // Check environment
    if (process.env.NODE_ENV === 'development') {
        console.log('Running in development mode');
        win.loadURL('http://localhost:5173'); // Vite dev server
        win.webContents.openDevTools();
    } else {
        console.log('Running in production mode');
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(createWindow);

// ... rest of your main process code

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});