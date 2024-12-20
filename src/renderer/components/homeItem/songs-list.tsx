
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { AppDispatch, RootState } from "../../store/store";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { removeSongs } from "../../store/songs-slice";

const songsList: React.FC = () => {
  const { songs } = useSelector((state: RootState) => state.songs);
  const dispatch = useDispatch<AppDispatch>();

  // 控制是否在批量删除中
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(0); // 当前删除的索引
  const [deletionInterval, setDeletionInterval] = useState<ReturnType<typeof setInterval> | null>(null); // 用于存储定时器

  // 批量删除的处理函数
  const handleBulkDelete = () => {
    // 如果当前是删除状态，停止删除
    if (isBulkDeleting) {
      if (deletionInterval) {
        clearInterval(deletionInterval); // 清除定时器
      }
      setIsBulkDeleting(false); // 停止删除
      setDeleteIndex(0); // 重置删除索引
    } else {
      setIsBulkDeleting(true); // 开始删除
      setDeleteIndex(0); // 重置删除索引
  
      // 设置定时器开始删除
      const interval = setInterval(async () => {
        if (deleteIndex < songs.length) {
          const song = songs[deleteIndex];
          dispatch(removeSongs({ id: song }));
  
          // 删除后等待保存
          const updatedsongs = songs.filter((h) => h !== song).join("\n");
          try {
            await window.electronAPI.saveSongs(updatedsongs);  // 使用 await 等待保存操作完成
            console.log(`Deleted song: ${song}`);
            setDeleteIndex((prev) => prev + 1); // 更新删除索引
          } catch (error) {
            console.error(`Error deleting song: ${song}`, error);
          }
        } else {
          // 删除完成，清除定时器
          clearInterval(interval);
          setIsBulkDeleting(false); // 停止删除状态
        }
      }, 2000); // 每 2 秒删除一个
      setDeletionInterval(interval); // 存储定时器
    }
  };
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
      {/* 显示习惯数组的长度 */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Total songs: {songs.length}
      </Typography>

      {/* 批量删除按钮 */}
      <Button
        variant="contained"
        color="error"
        onClick={handleBulkDelete}
        disabled={songs.length === 0}
      >
        {isBulkDeleting ? "Stop Deleting" : "Start Bulk Delete"}
      </Button>

      {songs.map((song) => {
        return (
          <Paper key={song} elevation={3} sx={{ p: 2 }}>
            <Grid container alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">{song}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {song}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => dispatch(removeSongs({ id: song }))}
                  >
                    Delete
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        );
      })}
    </Box>
  );
};


export default songsList;
