import foodModel from "../models/foodModel.js";
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../config/s3.js';

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const S3_BUCKET = process.env.S3_BUCKET || 'bigbite-food-images';
const IMAGE_BASE_PATH = ''; // Changed to an empty string

// Add food item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No file uploaded" });
        }

        // Generate unique filename
        const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
        const s3Key = IMAGE_BASE_PATH + fileName; // Corrected path

        // Upload to S3
        const uploadParams = {
            Bucket: S3_BUCKET,
            Key: s3Key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // Save to MongoDB
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: s3Key,
            imageFilename: fileName
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
        
        // Generate signed URLs for each image
        const foodsWithUrls = await Promise.all(foods.map(async (food) => {
            try {
                const imageUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION || 'eu-north-1'}.amazonaws.com/${food.image}`;
                
                return {
                    ...food._doc,
                    imageUrl: imageUrl
                };
            } catch (error) {
                console.error(`Error generating URL for food ${food._id}:`, error);
                return {
                    ...food._doc,
                    imageUrl: null,
                    imageError: "Could not generate image URL"
                };
            }
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
        await s3Client.send(new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: food.image
        }));

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