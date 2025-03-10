import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder,verifyOrder,userOrder,listOrders,updateStatus } from "../controllers/orderController.js";
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, express.json(), placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrder);
orderRouter.get('/list', async (req, res) => {
    try {
      let { page, limit, sortBy, sortOrder } = req.query;
  
      // Input validation
      page = parseInt(page) || 1; // Default to page 1 if invalid
      limit = parseInt(limit) || 10; // Default to 10 items per page if invalid
      sortBy = sortBy || "date"; // Default to sorting by date
      sortOrder = sortOrder || "desc"; // Default to descending order
  
      // Validate sortOrder
      if (sortOrder !== "asc" && sortOrder !== "desc") {
        sortOrder = "desc"; // Default to descending if invalid
      }
  
      const orders = await orderModel.find({})
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);
  
      // Get total count of orders for pagination
      const totalOrders = await orderModel.countDocuments();
  
      res.json({
        success: true,
        data: orders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit) // Calculate total pages
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, message: "Error fetching orders" });
    }
  });
  orderRouter.post('/delete', async (req, res) => { // Use POST request
    try {
      const { orderId } = req.body; // Extract orderId from request body
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ success: false, message: "Error deleting order" });
    }
  });

orderRouter.post("/status",updateStatus);



export default orderRouter;