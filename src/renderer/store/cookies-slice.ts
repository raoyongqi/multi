import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"


interface cookiesstate {
    cookies: string;
    isLoading: boolean;
    error: string | null;
}


const initialState: cookiesstate = {
    cookies: '',
    isLoading: false,
    error: null,
}

// 定义一个异步操作，使用 Electron API 获取 cookies
export const fetchCookies = createAsyncThunk(
  'cookies/fetchCookies',
  async () => {
    const content = await window.electronAPI.readCookies();  // 调用 Electron API
    return content;
  }
);

const cookiesSlice = createSlice({
  name: 'cookies',
  initialState,  // 初始状态，通常会定义一个包含默认值的状态对象

  reducers: {},
 extraReducers: (builder) => {
        builder
          // 处理 fetchsongs 的 pending 状态，表示请求正在进行中
          .addCase(fetchCookies.pending, (state) => {
            state.isLoading = true;  // 设置 isLoading 为 true，表示正在加载
          })
          // 处理 fetchsongs 的 fulfilled 状态，表示请求成功
          .addCase(fetchCookies.fulfilled, (state, action) => {
            state.isLoading = false;  // 设置 isLoading 为 false，表示加载完成
            state.cookies = action.payload;  // 将返回的数据存入 songs 数组
          })
          // 处理 fetchsongs 的 rejected 状态，表示请求失败
          .addCase(fetchCookies.rejected, (state, action) => {
            state.isLoading = false;  // 设置 isLoading 为 false，表示加载完成
            state.error = action.error.message || "Failed to fetch songs";  // 设置错误信息
          });
      },
});



export default cookiesSlice.reducer;
