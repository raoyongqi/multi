
declare global {
  interface Window {
    electronAPI: {

      readSongs: () => Promise<any>;  // 根据您的 JSON 数据结构，可以调整类型

      saveSongs: (songs: string) => void;
      readCookies: () => Promise<string>;  // 返回类型是 string, 你也可以根据实际情况修改
      fetchPlaylistTracks: (listId: string, cookie: string) => Promise<{ [key: string]: any }>;
      fetchPlaylistAll: (listId: string, cookie: string) => Promise<any[]>;
      saveTrackInfo: (trackName: string,trackID : string,trackLyrics: string) => Promise<string>;

      downloadTrackFromUrl: (url: string, downloadPath: string) => Promise<string>;

    };
  }
}

// 这个文件必须有一个 export 语句来让 TypeScript 识别为模块
export {};
