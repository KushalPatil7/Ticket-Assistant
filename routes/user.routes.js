import express from 'express';
import { getUser, login, logout, singUp, updateUser } from '../controller/user.js';
import { authenticate } from '../middleware/auth.js';


const router =express.Router();

router.post("/update-user",authenticate,updateUser)
router.get("/get-user",authenticate,getUser)
router


router.post("/signup",singUp);
router.post("/login",login)
router.post("/logout",logout)

export default router;