import { Schema, model, Types } from "mongoose";

export type ProjectStatus = "pending" | "approved" | "rejected";

const projectIdeaSchema = new Schema(
    {
        founderId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        problemStatement: {
            type: String,
            required: true,
        },
        solution: {
            type: String,
            required: true,
        },
        targetMarket: {
            type: String,
            required: true,
        },
        techStack: {
            type: [String],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        adminComment: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const ProjectIdea = model("ProjectIdea", projectIdeaSchema);
