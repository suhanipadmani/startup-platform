import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectIdea } from "../models/projectIdea.model";

export const submitIdea = async (req: AuthRequest, res: Response) => {
    try {
        const {
            title,
            problemStatement,
            solution,
            targetMarket,
            techStack,
        } = req.body;
    
        const project = await ProjectIdea.create({
            founderId: req.user!.userId,
            title,
            problemStatement,
            solution,
            targetMarket,
            techStack,
        });
    
        res.status(201).json(project);

    } catch (error) {
        console.error("Error in submitIdea controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyIdeas = async (req: AuthRequest, res: Response) => {
    try {
        const ideas = await ProjectIdea.find({
            founderId: req.user!.userId,
        }).sort({ createdAt: -1 });

        res.json(ideas);
    } catch (error) {
        console.error("Error in getMyIdeas controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getIdeaById = async (req: AuthRequest, res: Response) => {
    try {
        const project = await ProjectIdea.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.founderId.toString() !== req.user!.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(project);
    } catch (error) {
        console.error("Error in getIdeaById controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};










