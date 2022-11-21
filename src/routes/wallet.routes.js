import { postAmmount, getAmmounts } from "../controllers/wallet.controller.js"

import {Router} from "express";

const router = Router();

router.post("/mywallet", postAmmount);

router.get("/mywallet", getAmmounts);

export default router;