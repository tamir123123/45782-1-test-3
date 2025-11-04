// src/redux/meetingsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type Meeting from '../models/Meeting';
import type NewMeetingPayload from '../models/NewMeetingPayload';
import { getMeetingsByTeamCode, addMeeting } from '../services/api';

interface MeetingsState {
    meetings: Meeting[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: MeetingsState = {
    meetings: [],
    status: 'idle',
    error: null,
};

export const fetchMeetingsByTeam = createAsyncThunk(
    'meetings/fetchMeetingsByTeam',
    async (teamCode: string) => {
        const response = await getMeetingsByTeamCode(teamCode);
        return response;
    }
);

export const addNewMeeting = createAsyncThunk(
    'meetings/addNewMeeting',
    async (newMeeting: NewMeetingPayload, { rejectWithValue }) => {
        try {
            await addMeeting(newMeeting);
        } catch (err: any) {
            // Forward the backend's validation/conflict error message
            return rejectWithValue(err.response.data.message || 'Could not add meeting');
        }
    }
);

const meetingsSlice = createSlice({
    name: 'meetings',
    initialState,
    reducers: {
        clearMeetings: (state) => {
            state.meetings = [];
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetingsByTeam.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMeetingsByTeam.fulfilled, (state, action: PayloadAction<Meeting[]>) => {
                state.status = 'succeeded';
                state.meetings = action.payload;
            })
            .addCase(fetchMeetingsByTeam.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch meetings';
            })
            .addCase(addNewMeeting.rejected, (state, action) => {
                // Handle errors from adding a new meeting (e.g., conflicts)
                state.error = action.payload as string;
            });
    },
});

export const { clearMeetings } = meetingsSlice.actions;
export default meetingsSlice.reducer;