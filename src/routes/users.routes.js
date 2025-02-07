import express from "express";
import { 
    registerUser ,
    loginUser,
    logoutUser,
    refreshToken,
    getDashboardData,
} from "../controllers/users.controllers.js";
// import { authenticateUser } from "../middleware/auth.middleware.js";



const router = express.Router()

router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);
router.get("/logoutuser", logoutUser);
router.get("/getdashboard",getDashboardData);
router.post("/refreshtoken", refreshToken);


export default router;