const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Open external URLs in the default browser
  openExternal: (url) => shell.openExternal(url),

  // Listen for a Google auth success event from the main process
  onGoogleAuthSuccess: (callback) =>
    ipcRenderer.on('google-auth-success', (event, user) => callback(user)),

  // Optional: Once-only listener version (better for one-time auth callbacks)
  onceGoogleAuthSuccess: (callback) =>
    ipcRenderer.once('google-auth-success', (event, user) => callback(user)),

  // Optional: Send custom events from renderer to main
  send: (channel, data) => {
    const validChannels = ['google-auth-request', 'some-other-channel'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Optional: Listen for custom events from main
  on: (channel, callback) => {
    const validChannels = ['google-auth-success', 'some-other-response'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
});
