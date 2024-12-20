import Music from 'NeteaseCloudMusicApi';
import { useLogger } from './logger';
import { getLyrics, getDownloadUrl } from './singletrack';
const { logger } = useLogger('silly');
import sanitize from 'sanitize-filename';

async function getPlaylistAll(listId: string, cookie: string): Promise<{ [key: string]: any }[]> {
  try {
    // 获取播放列表中的所有歌曲
    const songs = await Music.playlist_track_all({ id: listId, cookie })
      .then((res) => {
        return res.body.songs as Record<string, any>[];
      })
      .then((songs) =>
        songs.map(({ name, ar, id }) => ({
          id,
          name: `${name} - ${(ar?.[0]?.name || 'Unknown Artist')}`,
        }))
      );

    const validSongs = []; // 存储有效歌曲的数组

    let count = 0; // 初始化计数器
    const startFrom = 105; // 从第 105 首歌曲开始查找，索引从 0 开始
    
    // 遍历歌曲列表，查找有效的 downloadUrl
    for (let i = startFrom; i < songs.length; i++) {
      const song = songs[i];
      count++; // 每遍历一首歌计数器加1
      logger.info(`Solving ${count} Songs : ${sanitize(song.name) || 'Undefined'}`); // 计算真实歌曲编号

      const trackId = song.id;
      const downloadUrl = await getDownloadUrl(trackId, cookie);

      if (downloadUrl) { // 如果有效的下载链接
        const lyrics = await getLyrics(trackId); // 获取歌词
        validSongs.push({
          song: song,
          lyric: lyrics || 'No lyrics available', // 如果没有歌词，返回默认文本
          url: downloadUrl,
        });

        logger.info(`Found valid song: ${sanitize(song.name)}`);
      }
    }

    if (validSongs.length === 0) {
      logger.info('No valid download URLs found in the provided songs.');
    }

    return validSongs; // 返回所有有效的歌曲

  } catch (error) {
    logger.error('Error fetching playlist tracks:', error);
    return []; // 出错时返回空数组
  }
}

export default getPlaylistAll;
