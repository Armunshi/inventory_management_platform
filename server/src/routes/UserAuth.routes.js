import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/UserAuth.controller";
import { verifyUser } from "../middleware/Auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router =Router()

router.post('/signup',upload.fields([
    {
        name:"avatar", // front end field should also be avatar
        maxCount: 1
    },
    {
        name:"coverImage",
        maxCount: 1
    }
]),registerUser)
router.post('/signin',loginUser)
router.post('/logout',verifyUser,logoutUser)
router.post('/refresh-token',verifyUser,refreshAccessToken)
export default router