import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

import os from 'os';
import getPlaylistTracks from '../common/tracks';
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


  ipcMain.handle('save-songs', (event, updatedHabits) => {
    // 直接指定文件保存路径
    const filePath = path.join(__dirname, '..', '..', 'common', 'data.txt'); // 设置保存路径
  
    // 保存文件
    fs.writeFile(filePath, updatedHabits, 'utf8', (err) => {
      if (err) {
        console.error('Failed to save the file:', err);
      } else {
        console.log('File saved successfully:', filePath);
      }
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


  ipcMain.handle('fetch-playlist-tracks', async (_, listId, cookie) => {
    return getPlaylistTracks(listId, cookie);

  });
  
};