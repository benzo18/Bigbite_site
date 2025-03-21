import foodModel from "../models/foodModel.js";
import fs from 'fs'


// add food items

const addFood = async (req,res) => {
    
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
        try {
            await food.save();
            res.json({success:true,message:"Food Added"})
        } catch (error) {
            console.log(error)
            res.json({success:false,message:"Failed to add food item"})
        }
}

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

const removeFood = async (req,res) =>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food item removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Failed to remove food item"})
    }
}

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