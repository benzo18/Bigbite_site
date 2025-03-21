import express from "express"
import { addFood,listFood,removeFood,updateFoodStockStatus } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();

//image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb) => {
       return cb(null, `${Date.now()}${file.originalname}`)
    }

})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood);
foodRouter.post("/update-stock-status", updateFoodStockStatus);






export default foodRouter;
