import foodModel from "../models/foodModel.js";
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import AWS from 'aws-sdk';


// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION || 'eu-north-1'
  });
  
// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// add food items
const addFood = async (req, res) => {
    try {
      // Upload to S3
      const s3Params = {
        Bucket: process.env.S3_BUCKET || 'bigbite-food-images',
        Key: `foods/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      };
  
      const s3Response = await s3.upload(s3Params).promise();
  
      // Save to MongoDB
      const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: s3Response.Key, // Store S3 object key
        imageFilename: s3Response.Key // Consistent with your schema
      });
  
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } catch (error) {
      console.error("S3 Upload Error:", error);
      res.json({ success: false, message: "Upload failed" });
    }
  };

// list all food items
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Failed to fetch food list"})
    }
}

// remove food items

const removeFood = async (req, res) => {
    try {
      const food = await foodModel.findById(req.body.id);
      
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
      res.json({ success: false, message: "Failed to remove food item" });
    }
  };

// Update food item's out of stock status
const updateFoodStockStatus = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        food.isOutOfStock = req.body.isOutOfStock; // Update the status
        await food.save();

        res.json({ success: true, message: "Food item status updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to update food item status" });
    }
};

export {addFood,listFood,removeFood, updateFoodStockStatus};