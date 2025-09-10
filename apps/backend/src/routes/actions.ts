import { Router } from "express";
import { createAvailaAction, getAvailableActionById, getAvailableActions, updateAvailableAction} from "../controller/actionController";

const router = Router()

router.post("/create",createAvailaAction);

router.get("/:id",getAvailableActionById);

router.get("/",getAvailableActions);

router.put("/:id",updateAvailableAction);    
    
export const actionRouter = router