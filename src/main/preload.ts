import { contextBridge, ipcRenderer } from 'electron';

// Define the types for the parameters in fetchPlaylistTracks
contextBridge.exposeInMainWorld('electronAPI', {
  saveSongs: (songs: string) => ipcRenderer.invoke('save-songs', songs),
  readSongs: () => ipcRenderer.invoke('read-songs'),
  readCookies: () => ipcRenderer.invoke('read-cookies'),

  fetchPlaylistAll: (listId: string, cookie: string) =>
    ipcRenderer.invoke('fetch-playlist-all', listId, cookie), // 这里修复了语法问题
  saveTrackInfo: (trackID: string, trackName: string,trackLyrics: string) => {
    return ipcRenderer.invoke('saveTrackInfo',trackID, trackName, trackLyrics);
  },
  downloadTrackFromUrl: async (trackName: string, url: string) => {
    // 调用主进程的 downloadTrackFromUrl 方法
    return await ipcRenderer.invoke('downloadTrackFromUrl',trackName, url);
  },
}, 

);
