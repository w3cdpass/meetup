require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
// const fetch = require('node-fetch');
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load frontend
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// === OAuth server on port 3001 ===
const startOAuthServer = () => {
  const oauthApp = express();

  oauthApp.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    const redirect_uri = 'http://localhost:3001/oauth2callback';

    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.VITE_GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();

      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const userInfo = await userInfoRes.json();

      const allWindows = BrowserWindow.getAllWindows();
      if (allWindows.length > 0) {
        allWindows[0].webContents.send('google-auth-success', userInfo);
      }

      res.send(`<html><body><script>window.close();</script>You can close this window now.</body></html>`);
    } catch (err) {
      console.error('OAuth Error:', err);
      res.status(500).send('OAuth failed');
    }
  });

  oauthApp.listen(3001, () => {
    console.log('Electron OAuth listening on http://localhost:3001');
  });
};

app.whenReady().then(() => {
  createWindow();
  startOAuthServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
