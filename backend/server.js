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
import mime from 'mime'; // You'll need to install this: `npm install mime`
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AWS from 'aws-sdk';  // Add this with your other imports

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

// Add this temporarily to server.js
app.get('/test-s3', (req, res) => {
    const s3 = new AWS.S3();
    s3.listBuckets((err, data) => {
      if (err) {
        console.error("S3 Error:", err);
        return res.status(500).send("S3 Connection Failed");
      }
      res.json({ buckets: data.Buckets });
    });
  });

//api endpoint
app.use("/api/food", foodRouter);



// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
  
  // Image serving with fallback
  app.use('/images', express.static('uploads'), (req, res, next) => {
    const requestedImage = req.path.replace('/', '');
    if (!fs.existsSync(path.join(__dirname, 'uploads', requestedImage))) {
      // Try to restore from backup
      const backupPath = path.join(__dirname, 'backup_uploads', requestedImage);
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, path.join(__dirname, 'uploads', requestedImage));
        console.log(`Restored missing image: ${requestedImage}`);
        return res.sendFile(path.join(__dirname, 'uploads', requestedImage));
      }
      // Ultimate fallback
      console.warn(`Image not found: ${requestedImage}`);
      res.status(404).send('Image not found');
    } else {
      next();
    }
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

