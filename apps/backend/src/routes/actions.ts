import { Router } from "express";
import { createAvailaAction, getAvailableActionById, getAvailableActions, updateAvailableAction} from "../controller/actionController";
import { adminMiddlewares } from "../middlewares/adminMiddlewares";

const router = Router()

router.post("/create",adminMiddlewares,createAvailaAction);

router.get("/:id",getAvailableActionById);

router.get("/",getAvailableActions);

router.put("/:id",adminMiddlewares,updateAvailableAction);    
    
export const actionRouter = router