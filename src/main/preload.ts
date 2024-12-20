import { contextBridge, ipcRenderer } from 'electron';

// Define the types for the parameters in fetchPlaylistTracks
contextBridge.exposeInMainWorld('electronAPI', {
  saveSongs: (songs: string) => ipcRenderer.invoke('save-songs', songs),
  readSongs: () => ipcRenderer.invoke('read-songs'),
  readCookies: () => ipcRenderer.invoke('read-cookies'),
  fetchPlaylistTracks: (listId: string, cookie: string) =>
    ipcRenderer.invoke('fetch-playlist-tracks', listId, cookie),
  fetchPlaylistAll: (listId: string, cookie: string) =>
    ipcRenderer.invoke('fetch-playlist-all', listId, cookie), // 这里修复了语法问题
  }, 

);
