// src/components/MeetingScheduler.tsx
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux-hooks';
import { fetchTeams } from '../redux/teamsSlice';
import MeetingCard from './MeetingCard';
import AddMeetingForm from './AddMeetingForm';
import { clearMeetings, fetchMeetingsByTeam } from '../redux/meetingSlice';

const MeetingScheduler = () => {
    const dispatch = useAppDispatch();
    const { teams, status: teamsStatus, error: teamsError } = useAppSelector((state) => state.teams);
    const { meetings, status: meetingsStatus, error: meetingsError } = useAppSelector((state) => state.meetings);
    const [selectedTeamCode, setSelectedTeamCode] = useState<string>('');

    useEffect(() => {
        if (teamsStatus === 'idle') {
            dispatch(fetchTeams());
        }
    }, [teamsStatus, dispatch]);

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const teamCode = e.target.value;
        setSelectedTeamCode(teamCode);
        if (teamCode) {
            dispatch(fetchMeetingsByTeam(teamCode));
        } else {
            dispatch(clearMeetings());
        }
    };

    return (
        <div>
            <h1>Team Meeting Scheduler</h1>
            <div className="selector-container">
                {teamsStatus === 'loading' && <p>Loading teams...</p>}
                {teamsError && <p className="error">Error fetching teams: {teamsError}</p>}
                <select onChange={handleTeamChange} value={selectedTeamCode} disabled={teamsStatus === 'loading'}>
                    <option value="">-- Select a Team --</option>
                    {teams.map(team => (
                        <option key={team.team_code} value={team.team_code}>
                            {team.team_name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTeamCode && <AddMeetingForm teamCode={selectedTeamCode} />}

            <div className="meetings-list">
                <h2>Appointments</h2>
                {meetingsStatus === 'loading' && <p>Loading meetings...</p>}
                {meetingsError && <p className="error">Error fetching meetings: {meetingsError}</p>}
                {meetingsStatus === 'succeeded' && meetings.length === 0 && selectedTeamCode && <p>No meetings found for this team.</p>}
                {meetings.map(meeting => (
                    <MeetingCard key={meeting.meeting_code} meeting={meeting} />
                ))}
            </div>
        </div>
    );
};

export default MeetingScheduler;