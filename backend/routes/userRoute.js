import express from "express";
import { loginUser, registerUser, googleLogin } from "../controllers/userController.js"; // Import googleLogin

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLogin); // Add the route for Google Sign-In

export default userRouter;