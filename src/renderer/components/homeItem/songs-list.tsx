import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { removeSongs } from "../../store/songs-slice";

const FirstSong: React.FC = () => {
  const { songs } = useSelector((state: RootState) => state.songs);
  const { cookies, isLoading, error } = useSelector(
    (state: RootState) => state.cookies
  );
  const dispatch = useDispatch<AppDispatch>();

  const [Downloading, setDownloading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false); // 添加取消状态

  const handleBulkDelete = async (song: string) => {
    try {
      // 先从 Redux 中移除歌曲
      dispatch(removeSongs({ id: song }));
      // 然后更新歌曲列表
      const updatedSongs = songs.filter((h) => h !== song).join("\n");
      await window.electronAPI.saveSongs(updatedSongs); // 使用 await 等待保存操作完成
      console.log(`Deleted song: ${song}`);
    } catch (error) {
      console.error(`Error deleting song: ${song}`, error);
    }
  };

  // 处理显示和下载歌曲信息的函数
  const handleOneList = async (song: string) => {
    if (isCancelled || Downloading) return; // 如果被取消或按钮已被点击，则不执行


    try {
      // 使用 await 调用异步的 fetchPlaylistTracks 函数，并传入 `song` 和 `cookies`
      const tracks = await window.electronAPI.fetchPlaylistAll(song, cookies);
      for (const track of tracks) {
        if (isCancelled) return; // 在每个循环中检查是否已取消

        const trackName = track.song.name;
        const trackID = track.song.id;
        const trackLyrics = track.lyric;
        const trackUrl = track.url;

        try {
          // 保存轨迹信息
          const savePath = await window.electronAPI.saveTrackInfo(trackName, trackID, trackLyrics);
          console.log(`Track info saved to: ${savePath}`);

          // 下载轨迹文件
          const downloadedFile = await window.electronAPI.downloadTrackFromUrl(trackName, trackUrl);
          console.log(`Track downloaded to: ${downloadedFile}`);
        } catch (error) {
          console.error(`Error processing track "${trackName}":`, error);
        }
      }

      await handleBulkDelete(song); // 调用删除函数删除当前歌曲

    } catch (err) {
      console.error("Error fetching tracks:", err); // 捕获并处理错误
    } finally {
    }
  };

  // 处理批量下载所有歌曲的函数
  const handleBulkDownload = async () => {

    if (Downloading || isCancelled) return; // 如果按钮已被点击或已经取消，则不执行
    
    
    setDownloading(true); // 设置按钮点击状态

    try {
      for (const song of songs) {
        if (isCancelled){

          
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
const handleCancel = () => {
  setIsCancelled((prev) => !prev); // 每次点击切换状态
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
