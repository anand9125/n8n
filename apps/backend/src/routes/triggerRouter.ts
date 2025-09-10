import { Router } from "express";
import { createAvailableTrigger, getAvailableTriggersById, getAvailableTriggers, updateAvailableTriggers } from "../controller/trigger";

const router = Router()

router.post("/create",createAvailableTrigger);

router.get("/:id",getAvailableTriggersById);

router.get("/",getAvailableTriggers);

router.put("/:id",updateAvailableTriggers);



export const triggerRouter = router