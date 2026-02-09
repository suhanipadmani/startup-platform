import { Schema, model } from "mongoose";

export type UserRole = "admin" | "founder";

const userSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true, 
            trim: true
        },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            trim: true 
        },
        password: { 
            type: String, 
            required: true,
            maxlength: 12,
            minlength: 6 
        },
        role: {
            type: String,
            enum: ["admin", "founder"],
            default: "founder",
        },
    },
    { timestamps: true }
);

export const User = model("User", userSchema);
