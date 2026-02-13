import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectIdea } from "../models/projectIdea.model";
import { getIO } from "../utils/socket";

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

        try {
            getIO().emit("project:created", project);
        } catch (err) {
            console.error("Socket emit failed", err);
        }

        res.status(201).json(project);

    } catch (error) {
        console.error("Error in submitIdea controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyIdeas = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        const query: any = {
            founderId: req.user!.userId,
        };

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const total = await ProjectIdea.countDocuments(query);
        const ideas = await ProjectIdea.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            projects: ideas,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
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










