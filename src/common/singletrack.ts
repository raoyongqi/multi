import Music from 'NeteaseCloudMusicApi';
import { ParseList,Lrc } from './types';

export async function getLyrics(songId: string): Promise<string> {
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
export async function getDownloadUrl(songId: string, cookie: string): Promise<string | null> {
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


