// src/controllers/meetings-controller.ts
import { Request, Response } from 'express';
import { Op } from 'sequelize'; // Import Sequelize Operators for advanced queries
import  Meeting, {NewMeetingPayload}  from '../../models/meeting-model';
import  Team  from '../../models/team-model';


// Controller to add a new meeting
export const addMeeting = async (req: Request, res: Response) => {
    // Request body is already validated by the `validate` middleware
    const { team_code, start_time, end_time, description, room } = req.body as NewMeetingPayload;

    // Convert string dates from payload (Joi-validated ISO strings) to Date objects for Sequelize
    const newMeetingStartTime = new Date(start_time);
    const newMeetingEndTime = new Date(end_time);

    try {
        // --- Overlapping Meetings Validation using Sequelize ---
        const overlappingMeetings = await Meeting.findAll({
            where: {
                team_code: team_code, // Check for overlaps only within the same team
                [Op.or]: [ // Check for any of these overlapping conditions
                    {
                        // Case 1: Existing meeting starts before new one ends AND ends after new one starts
                        // e.g., |---existing---|
                        //             |---new---|
                        start_time: { [Op.lt]: newMeetingEndTime },
                        end_time: { [Op.gt]: newMeetingStartTime }
                    },
                    // Case 2: New meeting fully encloses an existing meeting
                    // e.g.,    |---existing---|
                    //        |------new-------|
                    {
                        start_time: { [Op.gte]: newMeetingStartTime },
                        end_time: { [Op.lte]: newMeetingEndTime }
                    }
                ]
            },
            order: [['start_time', 'ASC']] // Order by start time for consistent results
        });

        if (overlappingMeetings.length > 0) {
            // If overlaps are found, return a 409 Conflict response
            const conflictingMeeting = overlappingMeetings[0]; // Take the first found conflicting meeting
            const durationMs = conflictingMeeting.end_time.getTime() - conflictingMeeting.start_time.getTime();
            const durationMinutes = Math.floor(durationMs / (1000 * 60));

            return res.status(409).json({
                message: 'Meeting overlaps with an existing meeting for this team.',
                conflicting_meeting: {
                    meeting_code: conflictingMeeting.meeting_code,
                    start_time: conflictingMeeting.start_time,
                    end_time: conflictingMeeting.end_time,
                    duration_minutes: durationMinutes
                }
            });
        }

        // If no overlaps, create the new meeting in the database
        await Meeting.create({
            team_code,
            start_time: newMeetingStartTime,
            end_time: newMeetingEndTime,
            description,
            room
        });
        res.status(201).json({ message: 'Meeting added successfully' });
    } catch (err: any) {
        console.error('Error adding new meeting:', err);
        res.status(500).json({ message: 'Error adding new meeting', error: err.message });
    }
};