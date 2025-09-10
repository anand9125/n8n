import { Router } from "express";
import { createAvailableTrigger, getAvailableTriggersById, getAvailableTriggers, updateAvailableTriggers } from "../controller/trigger";
import { adminMiddlewares } from "../middlewares/adminMiddlewares";

const router = Router()

router.post("/create",adminMiddlewares,createAvailableTrigger);

router.get("/:id",getAvailableTriggersById);

router.get("/",getAvailableTriggers);

router.put("/:id",adminMiddlewares,updateAvailableTriggers);



export const triggerRouter = router