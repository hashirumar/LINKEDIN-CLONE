import express from "express";
import {login,logout, signup}  from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
 

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.get("/me", protectRoute, getCurrentUser);

//protectRoute is A middleware function executed before the main route handler (getCurrentUser)
// Ensures the request is made by an authenticated user,Typically, it validates a token .
//not anyone can come and delete or create post, they have to follow a protected route
//we will then extract token from cookies, token exists?,token valid?,  getUserProfile   
export default router;