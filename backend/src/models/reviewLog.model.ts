import { Schema, model, Types } from "mongoose";

const reviewLogSchema = new Schema(
    {
        projectId: {
            type: Types.ObjectId,
            ref: "ProjectIdea",
            required: true,
        },
        adminId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            enum: ["approved", "rejected"],
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }    
);

export const ReviewLog = model("ReviewLog", reviewLogSchema);
