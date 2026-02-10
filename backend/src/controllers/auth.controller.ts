import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const inputRole = req.body.role;
        const role = (inputRole === 'admin' || inputRole === 'founder') ? inputRole : 'founder';

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const token = generateToken(user._id.toString(), user.role);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

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
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found in request" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error("Error in getMe:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (_req: AuthRequest, res: Response) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

