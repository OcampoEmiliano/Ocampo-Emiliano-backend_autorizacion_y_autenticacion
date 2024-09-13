import { Router } from "express";
import {register,login,logout,session}  from '../controllers/auth.controller.js';

export const userRouter = Router();

userRouter.post("/login",login);
userRouter.post("/register",register);
userRouter.get("/session",session);
userRouter.post("/logout",logout);