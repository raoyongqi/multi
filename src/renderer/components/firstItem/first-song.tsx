import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeSongs } from "../../store/songs-slice";

const FirstSong: React.FC = () => {
  const { songs } = useSelector((state: RootState) => state.songs);
  const { cookies, isLoading, error } = useSelector(
    (state: RootState) => state.cookies
  ); // 从 Redux 获取 cookies 状态
  const dispatch = useDispatch<AppDispatch>();
  
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleConsoleCookies = async (song: string) => {
    if (isButtonClicked) return; // 如果按钮已经被点击过，则不再执行
    setIsButtonClicked(true); // 设置按钮点击状态
  
    try {
      // 使用 await 调用异步的 fetchPlaylistTracks 函数，并传入 `song` 和 `cookies`
      const track = await window.electronAPI.fetchPlaylistAll(song, cookies);
      console.log(track);  // 打印返回的 track 到控制台
      
      // 将按钮设置为可以点击的状态
      setIsButtonClicked(false);  // 重置按钮状态
    } catch (err) {
      console.error('Error fetching tracks:', err);  // 捕获并处理错误
      setIsButtonClicked(false);  // 发生错误时也要重置按钮状态
    }
  };
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
      {songs.length > 0 ? (
        <Paper key={songs[0]} elevation={3} sx={{ p: 2 }}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">{songs[0]}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleConsoleCookies(songs[0])}
                  disabled={isButtonClicked} // 如果按钮已点击，禁用按钮
                >
                  {isButtonClicked ? "Clicked" : "Console Song"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => dispatch(removeSongs({ id: songs[0] }))}
                >
                  Delete
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
