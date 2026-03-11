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
        teamDetails: {
            type: String,
            required: true,
        },
        pitchDeckUrl: {
            type: String,
            default: "",
        },
        documents: [
            {
                name: { type: String, required: true },
                url: { type: String, required: true },
                uploadedAt: { type: Date, default: Date.now }
            }
        ],
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
