import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { useLogger } from '../common/logger';
const { logger } = useLogger('silly');
export async function downloadFile(url: string, downloadDir: string, name: string) {
  const filePath = path.join(downloadDir, `${name}.mp3`);

  // 如果文件已存在，跳过下载
  if (fs.existsSync(filePath)) {
    logger.info(`MP3 already exists: ${filePath}`);
    return Promise.resolve(); // 文件存在时直接返回已解决的 Promise
  }

  logger.info(`Downloading Url: ${url}`);



  const res = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
  });

  // 将响应流写入文件
  const writer = res.data.pipe(fs.createWriteStream(filePath));

  // 直接返回 Promise
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve); // 文件保存完成
    writer.on('error', reject);   // 发生错误
  });
}
