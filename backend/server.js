import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import orderModel from "./models/orderModel.js";
import fs from 'fs'; // Import the 'fs' module
import path from 'path'; // Import the 'path' module
import mime from 'mime'; // You'll need to install this: `npm install mime`



//app config
const app = express()
const port = process.env.PORT || 4000;

//middleware
app.use(express.json())
app.use(cors())

// Add COOP middleware here, before your routes
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); 
    next();
  });

//db connection
connectDB();

//api endpoint
app.use("/api/food", foodRouter);

// Serve images with correct Content-Type
app.use("/images", express.static('uploads'));
app.get("/images/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads', imageName);
    console.log("Image Path:", imagePath); // ADD THIS LINE

    fs.readFile(imagePath, (err, imageData) => {
        if (err) {
            console.error("File Read Error:", err); // ADD THIS LINE
            return res.status(404).send("Image not found");
        }

        // Determine the correct Content-Type based on the file extension
        
        const contentType = mime.getType(imagePath) || 'image/png'; // Default to jpeg if type can't be determined
        console.log("Content-Type:", contentType); // ADD THIS LINE
        res.contentType(contentType);
        res.send(imageData);
    });
});


app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);



app.get("/", (req, res) => {
    res.send("API Working")
})
app.get("/yoco-webhook", (req, res) => {
    res.status(200).send("Webhook received!");

});

// Yoco webhook endpoint
app.post("/yoco-webhook", async (req, res) => {
    try {
        console.log(req.body);

        const eventType = req.body.type;
        const eventData = req.body.payload;

        const eventHandlers = {
            "payment.succeeded": async () => {
                const orderId = eventData.metadata.orderId;
                const order = await orderModel.findById(orderId);

                if (order) {
                    order.payment = true;
                    order.paidAt = Date.now();
                    await order.save();

                    console.log(`Order ${orderId} updated to paid.`);

                    // Redirect to success URL after successful payment
                    res.redirect(302, eventData.metadata.successUrl);
                } else {
                    console.error(`Order ${orderId} not found.`);
                    res.status(404).send("Order not found");
                }
            },
            "payment.failed": async () => {
                const orderId = eventData.metadata.orderId;
                const order = await orderModel.findById(orderId);

                if (order) {
                    order.payment = false;
                    order.failedAt = Date.now();
                    await order.save();

                    console.log(`Order ${orderId} updated to failed.`);

                    // Redirect to cancel URL after failed payment
                    res.redirect(302, eventData.metadata.failureUrl);
                } else {
                    console.error(`Order ${orderId} not found.`);
                    res.status(404).send("Order not found");
                }
            },
            // Add more handlers for other event types as needed
        };

        const handler = eventHandlers[eventType];
        if (handler) {
            await handler();
        } else {
            console.log("Unhandled Yoco webhook event:", eventType);
            res.status(200).send();
        }

    } catch (error) {
        console.error("Error processing Yoco webhook:", error);
        res.status(500).send("Error processing webhook");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

