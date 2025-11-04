// src/components/MeetingCard.tsx
import React from 'react';
import type Meeting from '../models/Meeting';


interface MeetingCardProps {
    meeting: Meeting;
}

const formatDateTime = (isoString: string) => new Date(isoString).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
});

const calculateDuration = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
    return (
        <div className="card">
            <h3>{meeting.description}</h3>
            <p><strong>From:</strong> {formatDateTime(meeting.start_time)}</p>
            <p><strong>To:</strong> {formatDateTime(meeting.end_time)}</p>
            <p><strong>Duration:</strong> {calculateDuration(meeting.start_time, meeting.end_time)}</p>
            <p><strong>Room:</strong> {meeting.room}</p>
        </div>
    );
};

export default MeetingCard;