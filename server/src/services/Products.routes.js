import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { addProductController } from "../controllers/Product.controller";

const router = Router()


router.post('/addProd',upload.fields([
    {
        name:'images',
        maxCount:1
    }
]),addProductController)

export default router
