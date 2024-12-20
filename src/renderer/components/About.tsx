// src/App.tsx
//  组件名称大写
import { Provider } from 'react-redux';
import store from '../store/store';
import { Container } from '@mui/material';
import FirstSong from './firstItem/first-song';
import React from 'react';

const Home: React.FC = () => {
  return (
    <Provider store={store}>
      <Container maxWidth="md">
        
        <FirstSong/>

      </Container>
    </Provider>
  );
};

export default Home;
