// src/App.tsx
import { Provider } from 'react-redux';
import store from '../store/store';
import { Container } from '@mui/material';
import HabitsList from './homeItem/songs-list';
import HabitsStat from './homeItem/songs-stat';
import CookiesStat from './homeItem/cookies-stat';
import React from 'react';

const Home: React.FC = () => {
  return (
    <Provider store={store}>
      <Container maxWidth="md">
        <HabitsList />
        <HabitsStat />
        <CookiesStat />
      </Container>
    </Provider>
  );
};

export default Home;
