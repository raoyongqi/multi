import React, { useEffect, useState } from 'react';

const CookiesStat: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const content = await window.electronAPI.readCookies();  // 调用主进程的 read-file
        setFileContent(content);  // 设置文件内容
      } catch (err: any) {
        setError('Error reading file: ' + err.message);  // 处理错误
      }
    };

    fetchFileContent();
  }, []);

  return (
    <div>
      <h1>Cookies</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileContent ? (
        <pre>{fileContent}</pre>
      ) : (
        <p>Loading Cookies...</p>
      )}
    </div>
  );
};

export default CookiesStat;
