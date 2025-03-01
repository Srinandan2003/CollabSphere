import express from "express";
import { signUp, signIn, logOut } from "../controllers/auth.controller.js"; 

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/logOut", logOut); 

export default router;
