
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomEmail } from "../emails/emailHandlers.js";
import {ENV} from "../lib/env.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        });

        await newUser.save();

        // Generate JWT
        generateToken(newUser._id, res);

        // Send welcome email (use newUser, not savedUser)
        try {
            await sendWelcomEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL);
        } catch (error) {
            console.error("Failed to send welcome email:", error);
        }

        // Response
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message:"Invalid credentials"});

        const isPasssordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasssordCorrect) return res.status(400).json({message:"Invalid credentials"});

        generateToken(user._id, res);

        res.status(200).json({

            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic:user.profilePic

        });


        
    } catch (error) {
        console.error("Error in login controler:", error);
        res.status(500).json({message: "Internal server error"});
    }
    

};

export const logout =  (_, res) => {
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message:"Logged out successfully"})
};

