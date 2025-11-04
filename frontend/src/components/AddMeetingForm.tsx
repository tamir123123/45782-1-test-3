// src/components/AddMeetingForm.tsx
import React, { useState } from 'react';

import { useAppDispatch } from '../hooks/redux-hooks';

import type NewMeetingPayload from '../models/NewMeetingPayload';
import { addNewMeeting, fetchMeetingsByTeam } from '../redux/meetingSlice';
import { useForm, type SubmitHandler } from 'react-hook-form';


interface AddMeetingFormProps {
    teamCode: string;
}

type FormInputs = Omit<NewMeetingPayload, 'team_code'>;

const AddMeetingForm: React.FC<AddMeetingFormProps> = ({ teamCode }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormInputs>();
    const dispatch = useAppDispatch();
    const [apiError, setApiError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setApiError(null);
        const newMeeting: NewMeetingPayload = {
            team_code: teamCode,
            start_time: new Date(data.start_time).toISOString(),
            end_time: new Date(data.end_time).toISOString(),
            description: data.description,
            room: data.room
        };

        try {
            await dispatch(addNewMeeting(newMeeting)).unwrap();
            reset();
            dispatch(fetchMeetingsByTeam(teamCode));
        } catch (error) {
            setApiError(error as string);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <h3>Schedule New Meeting</h3>
            {apiError && <p className="error api-error">{apiError}</p>}
            <div className="form-group">
                <input {...register("description", { required: "Description is required" })} placeholder="Description" />
                {errors.description && <p className="error">{errors.description.message}</p>}
            </div>
            <div className="form-group">
                <input {...register("room", { required: "Room is required" })} placeholder="Room" />
                {errors.room && <p className="error">{errors.room.message}</p>}
            </div>
            <div className="form-group">
                <label>Start Time</label>
                <input type="datetime-local" {...register("start_time", { required: "Start time is required" })} />
                {errors.start_time && <p className="error">{errors.start_time.message}</p>}
            </div>
            <div className="form-group">
                <label>End Time</label>
                <input
                    type="datetime-local"
                    {...register("end_time", {
                        required: "End time is required",
                        validate: value => new Date(value) > new Date(watch('start_time')) || "End time must be after start time"
                    })}
                />
                {errors.end_time && <p className="error">{errors.end_time.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Meeting'}
            </button>
        </form>
    );
};

export default AddMeetingForm;