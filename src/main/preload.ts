import { contextBridge, ipcRenderer } from 'electron';

// Define the types for the parameters in fetchPlaylistTracks
contextBridge.exposeInMainWorld('electronAPI', {
  saveSongs: (songs: string) => ipcRenderer.invoke('save-songs', songs),
  readSongs: () => ipcRenderer.invoke('read-songs'),
  readCookies: () => ipcRenderer.invoke('read-cookies'),

  });
