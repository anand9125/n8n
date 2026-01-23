import { Router } from "express";
import { createAvailaAction, getAvailableActionById, getAvailableActions, updateAvailableAction} from "../controller/actionController.js";
import { adminMiddlewares } from "../middlewares/adminMiddlewares.js";

const router = Router()

router.post("/create",createAvailaAction);

router.get("/:id",getAvailableActionById);

router.get("/",getAvailableActions);

router.put("/:id",adminMiddlewares,updateAvailableAction);    
    
export const actionRouter = router