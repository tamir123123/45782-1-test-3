// src/models/meeting-model.ts
import { Table, Column, Model, PrimaryKey, Default, DataType, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Joi from 'joi';
import Team from './team-model';


@Table({
    tableName: 'meetings',
    underscored: true,
    timestamps: false, // Assuming you don't need createdAt/updatedAt for meetings
})
export default class Meeting extends Model<Meeting> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    meeting_code!: string;

    @ForeignKey(() => Team)
    @AllowNull(false)
    @Column(DataType.UUID) // Foreign key column must match the type of the primary key it references
    team_code!: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    start_time!: Date; // Sequelize handles Date objects

    @AllowNull(false)
    @Column(DataType.DATE)
    end_time!: Date;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    description!: string;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    room!: string;

    // Define the many-to-one relationship with Team
    @BelongsTo(() => Team, {
        foreignKey: 'team_code',
        targetKey: 'team_code'
    })
    team!: Team; // '!' to indicate it will be populated by Sequelize
}

// Joi schema for validating new meeting payload (remains largely the same)
export interface NewMeetingPayload {
    team_code: string;
    start_time: string; // Keep as string for Joi validation of ISO format
    end_time: string;   // Keep as string for Joi validation of ISO format
    description: string;
    room: string;
}

export const newMeetingSchema = Joi.object<NewMeetingPayload>({
    team_code: Joi.string().guid({ version: 'uuidv4' }).required(),
    start_time: Joi.date().iso().required().messages({
        'date.iso': 'Start time must be a valid date string',
        'any.required': 'Start time is required'
    }),
    end_time: Joi.date().iso().required().greater(Joi.ref('start_time')).messages({
        'date.iso': 'End time must be a valid date string',
        'date.greater': 'End time must be after start time',
        'any.required': 'End time is required'
    }),
    description: Joi.string().min(3).max(255).required().messages({
        'string.min': 'Description must be at least 3 characters long',
        'string.max': 'Description cannot exceed 255 characters',
        'any.required': 'Description is required'
    }),
    room: Joi.string().min(2).max(255).required().messages({
        'string.min': 'Room must be at least 2 characters long',
        'string.max': 'Room cannot exceed 255 characters',
        'any.required': 'Room is required'
    })
});