import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

import os from 'os';
import getPlaylistAll from '../common/trackall';
import {downloadFile} from './download';
import { useLogger } from '../common/logger';
const { logger } = useLogger('silly');

export function initBridge() {


// 监听文件读取请求
ipcMain.handle('read-cookies', (event) => {
  const userRoamingPath = path.join(os.homedir(), 'AppData', 'Roaming', 'recipe-saver');  // 指定保存路径
  const filePath = path.join(userRoamingPath, 'saved.txt');  // 文件路径
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return fileContent;  // 返回文件内容
  } else {
      throw new Error('文件不存在');
  }
});


  ipcMain.handle('save-songs', (event, songs) => {
    // 直接指定文件保存路径
    const filePath = path.join(__dirname, '..', '..', 'common', 'data.txt'); // 设置保存路径

    const tempPath = `${filePath}.tmp`;

    // 保存文件
    fs.writeFile(tempPath, songs, 'utf8', (err) => {
      if (err) {
        logger.error('Failed to write to temp file:', err);
        return;
      }

      fs.rename(tempPath, filePath, (err) => {
        if (err) {
          logger.error('Failed to replace the original file:', err);
        } else {
          logger.info('File saved successfully via atomic write:', filePath);
        }
      });
    });
  });

  ipcMain.handle('read-songs', async () => {

    const filePath = path.join(__dirname, '..', '..', 'common', 'data.txt');
  
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const lines = data.split('\n').map(line => line.trim()); // 分割每行并去除多余的空白
          resolve(lines);
        }
      });
    });
  
  });

  
  ipcMain.handle('fetch-playlist-all', async (_, listId, cookie) => {
    return getPlaylistAll(listId, cookie);

  });

  ipcMain.handle('saveTrackInfo', async (event,trackName, trackID, trackLyrics) => {
    logger.info(trackName)
    const safeTrackName = trackName.replace(/[\\\/:*?"<>|]/g, ''); // 去掉不合法的字符
    const saveDir = path.join(os.homedir(), 'Music', 'lyrics', safeTrackName); // Path to save the lyrics folder
    const savePath = path.join(saveDir, `${trackName}.txt`); // Full path to the file
    const saveIDPath = path.join(saveDir, `id.txt`); // Full path to the file
  
    const content = `Track Name: ${trackName}\n\nLyrics:\n${trackLyrics}`;
  
    // Ensure the directory exists; if not, create it
    if (fs.existsSync(saveDir)) {
      logger.info(`Directory exists: ${saveDir}`);
      
      // List files in the directory
      const files = fs.readdirSync(saveDir);
      if (files.length > 0) {


      logger.info('Directory contains files, skipping download.');            
      return savePath; // Return the saved file path
      
    }


    } else {
      logger.info(`Directory does not exist, creating: ${saveDir}`);
    }
  
    try {
      // Create the directory if it doesn't exist (recursive option ensures all parent dirs are created)
      fs.mkdirSync(saveDir, { recursive: true });
  
      // Write the content to the file
      fs.writeFileSync(savePath, content, 'utf-8');
      fs.writeFileSync(saveIDPath, trackID.toString(), 'utf-8');
  
      return savePath; // Return the saved file path
    } catch (error) {
      logger.error('Error saving file:', error);
      throw error; // If saving fails, throw an error
    }
  });

  ipcMain.handle('downloadTrackFromUrl', async (event, trackName: string, url: string) => {
    const safeTrackName = (trackName || '').toString(); // 确保是字符串
    const sanitizedTrackName = safeTrackName.replace(/[\\\/:*?"<>|]/g, '');
    const saveDir = path.join(os.homedir(), 'Music', 'lyrics', sanitizedTrackName); // Path to save the lyrics folder
  try {
    await downloadFile(url,saveDir, trackName); // 调用下载函数
    return trackName; // 返回下载路径
  } catch (error) {
    // 将 error 转换为 Error 类型
    const err = error instanceof Error ? error : new Error(String(error));
    throw new Error(`Failed to download track: ${err.message}`);
  }
});


};