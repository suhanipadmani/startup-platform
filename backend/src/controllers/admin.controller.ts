import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectIdea } from "../models/projectIdea.model";
import { ReviewLog } from "../models/reviewLog.model";
import { getIO } from "../utils/socket";

export const getAllProjects = async (req: Request, res: Response) => {
    const filter: any = {};
    if (req.query.status) {
        filter.status = req.query.status;
    }

    const projects = await ProjectIdea.find(filter)
        .populate("founderId", "name email")
        .sort({ createdAt: -1 });

    res.json(projects);
};

export const approveProject = async (req: AuthRequest, res: Response) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ message: "Comment is required" });
    }

    const project = await ProjectIdea.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    if (project.status !== "pending") {
        return res.status(400).json({ message: "Already reviewed" });
    }

    project.status = "approved";
    project.adminComment = comment;
    await project.save();

    await ReviewLog.create({
        projectId: project._id,
        adminId: req.user!.userId,
        action: "approved",
        comment,
    });

    try {
        getIO().emit("project:updated", project);
    } catch (err) {
        console.error("Socket emit failed", err);
    }

    res.json({ message: "Project approved" });
};

export const rejectProject = async (req: AuthRequest, res: Response) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ message: "Comment is required" });
    }

    const project = await ProjectIdea.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    if (project.status !== "pending") {
        return res.status(400).json({ message: "Already reviewed" });
    }

    project.status = "rejected";
    project.adminComment = comment;
    await project.save();

    await ReviewLog.create({
        projectId: project._id,
        adminId: req.user!.userId,
        action: "rejected",
        comment,
    });

    try {
        getIO().emit("project:updated", project);
    } catch (err) {
        console.error("Socket emit failed", err);
    }

    res.json({ message: "Project rejected" });
};






