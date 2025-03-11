import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import validator from "validator";
import { google } from "googleapis"; // Import googleapis

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation checks (using validator.js)
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log("Generated token:", token);

    res.json({
      token,
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Login failed" });
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log("Generated token:", token);

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
  const { code } = req.query; // Get the code from the query parameters

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Fetch the user's profile with the access token
    const gmail = google.gmail({ version: "v1", auth: client });
    const profile = await gmail.users.getProfile({ userId: "me" });

    // Extract user information from the profile
    const { emailAddress, name } = profile.data;

    // Check if user exists
    let user = await userModel.findOne({ email: emailAddress });

    if (!user) {
      // Generate a random password for new users
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create a new user
      user = new userModel({
        name: name,
        email: emailAddress,
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