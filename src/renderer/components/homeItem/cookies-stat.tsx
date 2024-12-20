import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCookies } from '../../store/cookies-slice';  // 引入 Redux 中的异步操作 `fetchCookies`
import { LinearProgress, Typography, Paper, Box } from '@mui/material';  // 引入 Material-UI 组件

import { AppDispatch, RootState } from '../../store/store';  // 引入应用的 dispatch 和 Redux 状态根类型

const CookiesStat: React.FC = () => {
  // 使用 `useSelector` 从 Redux store 中获取 cookies 数据、加载状态和错误信息
  const { isLoading, error } = useSelector((state: RootState) => state.cookies);
  
  const dispatch = useDispatch<AppDispatch>();  // 获取 dispatch 用于派发 Redux actions

  useEffect(() => {
    dispatch(fetchCookies());  // 组件加载时调用异步 action `fetchCookies` 获取数据
  }, []);  // 依赖数组为空，表示只在组件挂载时执行一次

  // 如果数据正在加载中，显示进度条
  if (isLoading) {
    return <LinearProgress />;  // 显示 Material-UI 提供的进度条
  }

  // 如果发生错误，显示错误信息
  if (error) {
    return <Typography color="error">{error}</Typography>;  // 显示错误信息，字体颜色为红色
  }
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Cookies Prepared</Typography>
    </Box>
  );
  // 如果有 cookies 数据，展示
};

export default CookiesStat;  // 导出该组件供其他地方使用
