import { json } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if (!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        if (password.length < 6){
            return res.status(400).json({message: "Password must be at lesat 6 charachter"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format"});
        }

        const user = await User.findOne({email})
        if (user) return res.status(400).json({message: "Email alredy exists"})

        // password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
        })

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });
        }

    } catch(error){
        console.log("Error in signup controller:", error)
        res.status(500).json({message: "Internal server error"})
    }
};