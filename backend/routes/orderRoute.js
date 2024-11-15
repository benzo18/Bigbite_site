import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder } from "../controllers/orderController.js";


const orderRouter = express.Router();

orderRouter.post("/place", placeOrder, authMiddleware);
orderRouter.post("/verify",yoco-webhook)
orderRouter.post("/userorders",authMiddleware,useOrders)




export default orderRouter;