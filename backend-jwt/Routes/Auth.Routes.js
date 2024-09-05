import { Router } from "express";
import {register,login,logout,session} from '../controllers/auth.controller.js';
import { validarJWT } from "../middlewares/validar-jwt.js";

const userRouter = Router();

userRouter.post("./login",login);
userRouter.post('./register',register);
userRouter.post('./logout',logout);
userRouter.get('./session',validarJWT,session);