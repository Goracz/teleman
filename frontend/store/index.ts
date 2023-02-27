import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './app-slice';

const store = configureStore({
  reducer: {
    app: appReducer,
    // notifications: notificationReducer,
  },
});

export default store;
