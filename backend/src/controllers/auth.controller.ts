import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
    
        if(password.length < 6 || password.length > 12){
            return res.status(400).json({ message: "Password must be between 6 and 12 characters" });
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Invalid email address" });
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "founder",
        });
    
        res.status(201).json({ message: "Founder registered successfully" });

    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    
        const token = generateToken(user._id.toString(), user.role);
    
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error in login:",error);
        res.status(500).json({ message: "Internal server error" });
    }
};
