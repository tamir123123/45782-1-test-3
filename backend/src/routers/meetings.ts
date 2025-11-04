import { Router } from "express";
import { validate } from "../middlewares/validation-middleware";
import { newMeetingSchema } from "../models/meeting-model";
import { addMeeting } from "../controllers/meeting/meeting";



const router = Router()
router.post('/', validate(newMeetingSchema), addMeeting);

export default router
