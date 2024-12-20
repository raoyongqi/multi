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

  const [isButtonClicked, setIsButtonClicked] = useState(false);
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
    if (isCancelled || isButtonClicked) return; // 如果被取消或按钮已被点击，则不执行

    setIsButtonClicked(true); // 设置按钮点击状态

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
      setIsButtonClicked(false); // 恢复按钮的可点击状态
    }
  };

  // 处理批量下载所有歌曲的函数
  const handleBulkDownload = async () => {
    if (isButtonClicked || isCancelled) return; // 如果按钮已被点击或已经取消，则不执行
    setIsButtonClicked(true); // 设置按钮点击状态

    try {
      for (const song of songs) {
        if (isCancelled) return; // 在每次循环时检查是否被取消
        await handleOneList(song); // 按顺序处理每个歌曲
      }
      console.log("Bulk download complete.");
    } catch (err) {
      console.error("Error during bulk download:", err);
    } finally {
      setIsButtonClicked(false); // 恢复按钮的可点击状态
    }
  };

  // 处理取消下载操作的函数
  const handleCancel = () => {
    setIsCancelled(true); // 设置取消状态为 true
    setIsButtonClicked(false); // 恢复按钮可点击状态
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
                  disabled={isButtonClicked || isCancelled} // 如果按钮已点击或操作已取消，禁用按钮
                >
                  {isButtonClicked ? "Downloading..." : "Bulk Download"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel} // 取消按钮
                  disabled={isCancelled || isButtonClicked} // 如果已取消或按钮正在进行中，禁用
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
