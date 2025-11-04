// src/controllers/teams-controller.ts
import { Request, Response, NextFunction } from 'express';
import  Team  from '../../models/team-model';
import  Meeting  from '../../models/meeting-model';

/**
 * Controller to fetch all development teams.
 * Responds with a list of all teams.
 */
export const getTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teams = await Team.findAll({
            attributes: ['team_code', 'team_name'],
            order: [['team_name', 'ASC']] // It's good practice to order results
        });
        res.json(teams);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller to fetch all meetings for a specific team.
 * The team_code is provided as a URL parameter.
 * Responds with a list of meetings for that team.
 */
export const getMeetingsByTeam = async (req: Request, res: Response, next: NextFunction) => {
    // The team_code parameter has already been validated by the middleware
    const { team_code } = req.params;
    try {
        const meetings = await Meeting.findAll({
            where: { team_code },
            attributes: ['meeting_code', 'start_time', 'end_time', 'description', 'room'],
            order: [['start_time', 'ASC']]
        });
        res.json(meetings);
    } catch (err) {
        next(err);
    }
};