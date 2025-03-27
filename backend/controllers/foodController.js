import foodModel from "../models/foodModel.js";
import AWS from 'aws-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION || 'eu-north-1'
});

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add food item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No file uploaded" });
        }

        // Upload to S3
        const s3Params = {
            Bucket: process.env.S3_BUCKET || 'bigbite-food-images',
            Key: `foods/${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`, // Replace spaces with underscores
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read' // Make the file publicly accessible
        };

        const s3Response = await s3.upload(s3Params).promise();

        // Save to MongoDB
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: s3Response.Key, // Store the S3 object key
            imageFilename: s3Response.Key // For consistency
        });

        await food.save();
        res.json({ success: true, message: "Food Added", data: food });
    } catch (error) {
        console.error("S3 Upload Error:", error);
        res.json({ 
            success: false, 
            message: "Upload failed",
            error: error.message 
        });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        
        // Optionally: Add full S3 URL to each food item
        const foodsWithUrls = foods.map(food => ({
            ...food._doc,
            imageUrl: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${food.image}`
        }));
        
        res.json({ success: true, data: foodsWithUrls });
    } catch (error) {
        console.error("List Error:", error);
        res.json({ 
            success: false, 
            message: "Failed to fetch food list",
            error: error.message 
        });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Delete from S3
        await s3.deleteObject({
            Bucket: process.env.S3_BUCKET,
            Key: food.image
        }).promise();

        // Delete from MongoDB
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food item removed" });
    } catch (error) {
        console.error("Deletion Error:", error);
        res.json({ 
            success: false, 
            message: "Failed to remove food item",
            error: error.message 
        });
    }
};

// Update stock status
const updateFoodStockStatus = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        food.isOutOfStock = req.body.isOutOfStock;
        await food.save();

        res.json({ success: true, message: "Food item status updated" });
    } catch (error) {
        console.error("Stock Update Error:", error);
        res.json({ 
            success: false, 
            message: "Failed to update food item status",
            error: error.message 
        });
    }
};

export { addFood, listFood, removeFood, updateFoodStockStatus };