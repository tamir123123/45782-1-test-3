import axios from 'axios';
import type Team from '../models/Team';
import type Meeting from '../models/Meeting';
import type NewMeetingPayload from '../models/NewMeetingPayload';


// The base URL for your backend server.
const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllTeams = async (): Promise<Team[]> => {
    const response = await apiClient.get<Team[]>('/teams');
    return response.data;
};

export const getMeetingsByTeamCode = async (teamCode: string): Promise<Meeting[]> => {
    // If no teamCode is provided, return an empty array to prevent a 404 API call.
    if (!teamCode) return [];
    const response = await apiClient.get<Meeting[]>(`/teams/${teamCode}/meetings`);
    return response.data;
};

export const addMeeting = async (newMeeting: NewMeetingPayload) => {
    const response = await apiClient.post('/meetings', newMeeting);
    return response.data;
};