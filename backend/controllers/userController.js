import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import validator from "validator";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // Generate the JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log("Generated token:", token);

    // Include the token in the response
    res.json({
      token,
      success: true,
      message: "Logged in successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    // More comprehensive input validation (example using validator.js)
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Stronger password validation (example using a regular expression)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    if (!name || name.trim() === "") {
      return res.json({ success: false, message: "Name is required" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new user
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Generate the JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log("Generated token:", token);

    // Respond with the token
    res.json({
      success: true,
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// Google Sign-In
const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Extract user information
    const { name, email } = payload;

    // Check if user exists
    let user = await userModel.findOne({ email });

    if (!user) {
      // Generate a random password
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create a new user
      user = new userModel({
        name: name,
        email: email,
        password: hashedPassword,
      });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ success: false, message: "Google login failed" });
  }
};

export { loginUser, registerUser, googleLogin };