import { Table, Column, Model, PrimaryKey, Default, DataType, AllowNull, Unique, HasMany } from 'sequelize-typescript';
import Joi from 'joi';
import  Meeting  from './meeting-model'; // Import Meeting for relationship
@Table({
    tableName: 'teams', // Explicitly set table name if different from class name
    underscored: true,
    timestamps: false, // Assuming you don't need createdAt/updatedAt for teams
})
export default class Team extends Model<Team> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    team_code!: string; // Using '!' for definite assignment assertion

    @AllowNull(false)
    @Unique(true) // Ensure team names are unique
    @Column(DataType.STRING(255)) // VARCHAR(255)
    team_name!: string;

    @HasMany(() => Meeting, {
        foreignKey: 'team_code', // The foreign key in the Meeting model
        sourceKey: 'team_code',   // The primary key in this model
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    meetings!: Meeting[]; // Array of meetings associated with this team
}

// Joi schema for validating team_code (e.g., in URL parameters)
export const teamCodeSchema = Joi.string().guid({ version: 'uuidv4' }).required();

// Joi schema for adding/updating a team (if you had such routes)
export const newTeamSchema = Joi.object({
    team_name: Joi.string().min(3).max(255).required(),
});