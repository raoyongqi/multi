import Music from 'NeteaseCloudMusicApi';

import { useLogger } from './logger'

import { ParseList,Lrc } from './types';

const { logger } = useLogger('silly');

import sanitize from 'sanitize-filename'


async function getPlaylistTracks(listId: string, cookie: string):  Promise<{ [key: string]: any }> {
    try {
      // 获取播放列表中的歌曲
      const songs = await Music.playlist_track_all({ id: listId, cookie })
        .then((res) => {
          // console.log(`Response from API:`, res.body);  // 打印响应内容，看看返回的数据
          return res.body.songs as Record<string, any>[];
        })
        .then((songs) =>
          songs.map(({ name, ar, id }) => ({
            id,
            name: `${name} - ${(ar?.[0]?.name || 'Unknown Artist')}`,
          }))
        );
        
      // 获取第一首歌的歌词
      let firstTrackLyrics = '';
      let firstDownloadUrl =null;
      let firstSong = null; // 记录找到的最后一首有效歌曲
      
      let count = 0; // 初始化计数器
      const startFrom = 105; // 从第 105 首歌曲开始查找，索引从 0 开始
      
      for (let i = startFrom; i < songs.length; i++) {
        const song = songs[i];
        count++; // 每遍历一首歌计数器加1
        logger.info(`Solving ${count + startFrom} Songs : ${sanitize(song.name) || 'Undefind'}`); // 计算真实歌曲编号
        
        const trackId = song.id;
        const downloadUrl = await getDownloadUrl(trackId, cookie);
        
        if (downloadUrl) { // 检查 downloadUrl 是否有效
          firstDownloadUrl = downloadUrl;
          firstTrackLyrics = await getLyrics(trackId); // 获取歌词
          firstSong = song;  // 记录当前歌曲名称

          
          logger.info(`Sloving Links${sanitize(song.name)}`);
          break; // 找到后立即退出循环
        }
      }
      
      
      if (!firstDownloadUrl) {
        logger.info('No valid download URL found in the provided songs.');
      }
      
      return { song: firstSong, lyric: firstTrackLyrics, url: firstDownloadUrl };
      
    } catch (error) {
      return { firstTrackLyrics: 'Failed to fetch lyrics.' };
    }
  }

  async function getLyrics(songId: string): Promise<string> {
    try {
      // 调用 API 获取歌词
      const res = await Music.lyric({ id: songId });
      // 使用类型保护判断 res.body.lrc 是否符合 Lrc 接口
      if (res.body && res.body.lrc && typeof res.body.lrc === "object") {
        const lrc = res.body.lrc as Lrc;  // 使用类型断言，将 lrc 强制转换为 Lrc 类型
  
        if (lrc.lyric) {
          return lrc.lyric;
        } else {
          throw new Error("Lyric not found");
        }
      } else {
        throw new Error("No lyrics available or empty lrc object");
      }
    } catch (error) {
      // console.error(error);
      return "Error fetching lyrics";
    }
  }


  
// Function to get the download URL of a song
async function getDownloadUrl(songId: string, cookie: string): Promise<string | null> {
    try {
      // Fetch the download URL using the songId and cookie
      const res = await Music.song_download_url({ id: songId, cookie });
  
      // Extract the download URL from the response
      const downloadUrl = (res.body.data as any).url;
      if (downloadUrl) {
        return downloadUrl; // Return the download URL if available
      } else {
        return null; // Return null if downloadUrl is not available
      }
    } catch (error) {
      console.error('Error fetching download URL:', error);
      throw error;
    }
  }


export default getPlaylistTracks;