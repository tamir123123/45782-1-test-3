import { Router } from "express";
import { getMeetingsByTeam, getTeams } from "../controllers/teams/team";
import { validateParams } from "../middlewares/validation-middleware";
import { teamCodeSchema } from "../models/team-model";



const router = Router()
router.get('/', getTeams);
router.get('/:team_code/meetings', validateParams('team_code', teamCodeSchema), getMeetingsByTeam);


export default router
