import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectIdea } from "../models/projectIdea.model";
import { getIO } from "../utils/socket";
import { Types } from "mongoose";

export const createIdea = async (req: AuthRequest, res: Response) => {
    try {
        const { title, problemStatement, solution, targetMarket, techStack } = req.body;

        const newIdea = await ProjectIdea.create({
            founderId: req.user!.userId,
            title,
            problemStatement,
            solution,
            targetMarket,
            techStack,
            status: "pending",
        });

        try {
            getIO().emit("idea:created", newIdea);
        } catch (err) {
            console.error("Socket emit failed", err)
        }

        res.status(201).json(newIdea);
    } catch (error) {
        res.status(500).json({ message: "Error creating idea" });
    }
};

export const getMyIdeas = async (req: AuthRequest, res: Response) => {
    try {
        const filter: any = {};

        if (req.user?.role !== 'admin') {
            filter.founderId = req.user!.userId;
        }

        if (req.query.status) {
            const statusParam = req.query.status as string;
            if (statusParam.includes(',')) {
                filter.status = { $in: statusParam.split(',') };
            } else {
                filter.status = statusParam;
            }
        }

        if (req.query.search) {
            const search = req.query.search as string;
            filter.title = { $regex: new RegExp(search, 'i') };
        }

        const sort: any = {};
        if (req.query.sortBy) {
            const order = req.query.order === 'asc' ? 1 : -1;
            sort[req.query.sortBy as string] = order;
        } else {
            sort.createdAt = -1;
        }

        const ideas = await ProjectIdea.find(filter)
            .populate("founderId", "name email")
            .sort(sort);

        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: "Error fetching ideas" });
    }
};

export const getIdeaById = async (req: AuthRequest, res: Response) => {
    try {
        const idea = await ProjectIdea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: "Idea not found" });
        }
        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: "Error fetching idea" });
    }
};

export const updateIdea = async (req: AuthRequest, res: Response) => {
    try {
        const idea = await ProjectIdea.findOne({ _id: req.params.id, founderId: req.user!.userId });
        if (!idea) {
            return res.status(404).json({ message: "Idea not found or unauthorized" });
        }

        if (idea.status !== "pending") {
            return res.status(400).json({ message: "Cannot edit processed idea" });
        }

        const { title, problemStatement, solution, targetMarket, techStack } = req.body;

        if (title) idea.title = title;
        if (problemStatement) idea.problemStatement = problemStatement;
        if (solution) idea.solution = solution;
        if (targetMarket) idea.targetMarket = targetMarket;
        if (techStack) idea.techStack = techStack;

        await idea.save();

        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: "Error updating idea" });
    }
};

export const deleteIdea = async (req: AuthRequest, res: Response) => {
    try {
        const idea = await ProjectIdea.findOneAndDelete({ _id: req.params.id, founderId: req.user!.userId });
        if (!idea) {
            return res.status(404).json({ message: "Idea not found or unauthorized" });
        }
        res.json({ message: "Idea deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting idea" });
    }
};

export const getIdeaStats = async (req: AuthRequest, res: Response) => {
    try {
        const founderId = req.user!.userId;

        const stats = await ProjectIdea.aggregate([
            { $match: { founderId: new Types.ObjectId(founderId) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    },
                    approved: {
                        $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    pending: 1,
                    approved: 1,
                    rejected: 1
                }
            }
        ]);

        const result = stats.length > 0 ? stats[0] : { total: 0, pending: 0, approved: 0, rejected: 0 };
        res.json(result);
    } catch (error) {
        console.error("Error fetching idea stats:", error);
        res.status(500).json({ message: "Error fetching idea stats" });
    }
};
