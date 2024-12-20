// src/App.tsx
//  组件名称大写
import { Provider } from 'react-redux';
import store from '../store/store';
import { Container } from '@mui/material';
import CookiesStat from './firstItem/cookies-stat';
import React from 'react';

const Home: React.FC = () => {
  return (
    <Provider store={store}>
      <Container maxWidth="md">
        
        <CookiesStat/>

      </Container>
    </Provider>
  );
};

export default Home;
