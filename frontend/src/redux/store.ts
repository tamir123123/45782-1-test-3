// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import teamsReducer from './teamsSlice';
import meetingsReducer from './meetingSlice';

export const store = configureStore({
    reducer: {
        teams: teamsReducer,
        meetings: meetingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;