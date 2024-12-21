import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { removeSongs } from "../../store/songs-slice";
import { useRef, useEffect } from 'react';

const FirstSong: React.FC = () => {
  const { songs } = useSelector((state: RootState) => state.songs);
  const { cookies, isLoading, error } = useSelector(
    (state: RootState) => state.cookies
  );
  
  const dispatch = useDispatch<AppDispatch>();



// 保存歌曲的逻辑
useEffect(() => {
  // 如果 songs 不为空，才执行保存操作
  if (songs.length > 0) {
    const saveSongs = async () => {
      try {
        const updatedSongs = songs.join("\n");
        await window.electronAPI.saveSongs(updatedSongs); // 使用 await 等待保存操作完成
      } catch (error) {
        console.error("Error saving songs:", error);
      }
    };

    saveSongs(); // 调用保存操作
  }
}, [songs]); // 依赖于 songs 更新



  const handleBulkDelete = async (song: string) => {
    try {
      // 从 Redux 中移除歌曲
      dispatch(removeSongs({ id: song }));
      
    } catch (error) {
      console.error(`Error deleting song: ${song}`, error);
    }
  };

  const [Downloading, setDownloading] = useState(false);
  const [isCancelled,setIsCancelled] = useState(false); // 取消状态
  const isCancelledRef = useRef(false); // 初始值为 false

  const handleCancel = () => {
    setIsCancelled((prev) => !prev); // 每次点击切换状态
  };
  
  // 每次 `isCancelled` 变化时，更新 `ref` 的值
  useEffect(() => {
    isCancelledRef.current = isCancelled;
  }, [isCancelled]);

  
const handleBulkDownload = async () => {

  
  if (isCancelledRef.current ) return; // 如果已取消则不执行
  
  setDownloading(true); // 设置按钮点击状态

  try {
    for (const song of songs) {
      console.log(`handleBulkDownload: ${isCancelledRef.current }`)

      if (isCancelledRef.current ) {
        setDownloading(false); // 恢复按钮的可点击状态
        return; // 在每次循环时检查是否被取消
      }



      await handleOneList(song); // 按顺序处理每个歌曲
    }
  } catch (err) {
    console.error("Error during bulk download:", err);
  } finally {
    setDownloading(false); // 恢复按钮的可点击状态
  }
};

// 处理取消/恢复下载操作的函数

// 处理显示和下载歌曲信息的函数
const handleOneList = async (song: string) => {
  if (isCancelledRef.current ) return; // 如果被取消，则退出

  try {
    // 使用 await 调用异步的 fetchPlaylistTracks 函数，并传入 `song` 和 `cookies`
    const tracks = await window.electronAPI.fetchPlaylistAll(song, cookies);
    for (const track of tracks) {
      if (isCancelledRef.current ) return; // 在每个循环中检查是否已取消
      console.log(`handleOneList: ${(isCancelledRef.current )}`)

      const { name, id, lyric, url } = track.song;

      try {
        // 保存轨迹信息
        await window.electronAPI.saveTrackInfo(name, id, lyric);

        // 下载轨迹文件
        await window.electronAPI.downloadTrackFromUrl(name, url);


      } catch (error) {
        console.error(`Error processing track "${name}":`, error);
      }
    }

    await handleBulkDelete(song); // 调用删除函数删除当前歌曲

  } catch (err) {
    console.error("Error fetching tracks:", err); // 捕获并处理错误
  }
};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
      {songs.length > 0 ? (
        
        <Paper key={songs[0]} elevation={3} sx={{ p: 2 }}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Total songs: {songs.length}
            </Typography>
              <Typography variant="h6">{songs[0]}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleBulkDownload} // 批量下载按钮
                  disabled={Downloading } // 如果按钮已点击或操作已取消，禁用按钮
                >
                  {Downloading ? "Downloading..." : "Bulk Download"}
                </Button>
                <Button
                variant="outlined"
                onClick={handleCancel} // 点击触发取消或恢复
                disabled={!Downloading} // 如果没有进行中的下载，禁用按钮
                sx={{
                  backgroundColor: isCancelled ? "red" : "blue", // 背景色
                  color: "white", // 保持文本对比度为白色
                  borderColor: isCancelled ? "red" : "blue", // 边框色与背景一致
                  "&:hover": {
                    backgroundColor: isCancelled ? "darkred" : "darkblue", // 悬停时加深背景色
                  },
                  "&:disabled": {
                    backgroundColor: "lightgray", // 禁用时背景色灰色
                    color: "gray",
                    borderColor: "gray",
                  },
                }}
              >
                {isCancelled ? "Cancelled" : "Cancel Download"}
              </Button>


              </Box>
            </Grid>
          </Grid>

          {/* 显示 cookies 数据 */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Cookies:</Typography>
            {isLoading ? (
              <Typography variant="body2" color="text.secondary">
                Loading cookies...
              </Typography>
            ) : error ? (
              <Typography variant="body2" color="error">
                Error loading cookies: {error}
              </Typography>
            ) : (
              <pre>{cookies ? JSON.stringify(cookies, null, 2) : "No cookies available"}</pre>
            )}
          </Box>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No songs available.
        </Typography>
      )}
    </Box>
  );
};

export default FirstSong;
