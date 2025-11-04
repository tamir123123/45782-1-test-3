// src/redux/teamsSlice.ts

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type Team from '../models/Team';
import { getAllTeams } from '../services/api';

interface TeamsState {
    teams: Team[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TeamsState = {
    teams: [],
    status: 'idle',
    error: null,
};

export const fetchTeams = createAsyncThunk('teams/fetchTeams', async () => {
    const response = await getAllTeams();
    return response;
});

const teamsSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeams.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
                state.status = 'succeeded';
                state.teams = action.payload;
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch teams';
            });
    },
});

export default teamsSlice.reducer;