import { Box, Button, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from 'react';
import DeleteIcon from "@mui/icons-material/Delete";
import { removeSongs } from "../../store/songs-slice";


const FirstSong: React.FC = () => {
  const { songs } = useSelector((state: RootState) => state.songs);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
      {songs.length > 0 ? (
        <Paper key={songs[0]} elevation={3} sx={{ p: 2 }}>
          <Grid container alignItems="center">
            <Grid xs={12} sm={6}>
              <Typography variant="h6">{songs[0]}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textTransform: "capitalize" }}
              >
                {songs[0]}
              </Typography>
            </Grid>
  
            <Grid xs={12} sm={6}>
              <Box
                sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
              >

  
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => dispatch(removeSongs({ id: songs[0]}))}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          </Grid>
  
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Current Streak: {10} days
            </Typography>
  
            <LinearProgress
              variant="determinate"
              value={(10 / 30) * 100}
              sx={{ mt: 1 }}
            ></LinearProgress>
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