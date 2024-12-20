// src/App.tsx
import { Provider } from 'react-redux';
import store from '../store/store';
import { Container } from '@mui/material';
import HabitsList from './homeItem/songs-list';
import HabitsStat from './homeItem/songs-stat';
import React from 'react';
import CookiesStat from './homeItem/cookies-stat';

const Home: React.FC = () => {
  return (
    <Provider store={store}>
      <Container maxWidth="md">
        <HabitsList />
                <CookiesStat/>
        <HabitsStat />
      </Container>
    </Provider>
  );
};

export default Home;
