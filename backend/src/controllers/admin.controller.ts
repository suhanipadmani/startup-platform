import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectIdea } from "../models/projectIdea.model";
import { ReviewLog } from "../models/reviewLog.model";
import { User } from "../models/user.model";
import { getIO } from "../utils/socket";

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const filter: any = {};
        const { status, tech, search } = req.query;

        // Status Filter
        if (status) {
            const statusParam = status as string;
            if (statusParam.includes(',')) {
                filter.status = { $in: statusParam.split(',') };
            } else {
                filter.status = statusParam;
            }
        }

        // Tech Stack Filter
        if (tech) {
            filter.techStack = { $regex: new RegExp(tech as string, 'i') };
        }

        // Search Filter (Title)
        if (search) {
            filter.title = { $regex: new RegExp(search as string, 'i') };
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const totalDocs = await ProjectIdea.countDocuments(filter);
        const projects = await ProjectIdea.find(filter)
            .populate("founderId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            docs: projects,
            totalDocs,
            limit,
            page,
            totalPages: Math.ceil(totalDocs / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects" });
    }
};

export const approveProject = async (req: AuthRequest, res: Response) => {
    const { comment } = req.body;

    try {
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
    } catch (error: any) {
        console.error("Error approving project:", error);
        res.status(500).json({ 
            message: "Error approving project",
            error: error.message || String(error)
        });
    }
};

export const rejectProject = async (req: AuthRequest, res: Response) => {
    const { comment } = req.body;

    try {
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
    } catch (error: any) {
        console.error("Error rejecting project:", error);
        res.status(500).json({ 
            message: "Error rejecting project",
            error: error.message || String(error)
        });
    }
};

// User Management
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } }
            ];
        }

        const skip = (page - 1) * limit;

        const totalDocs = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            docs: users,
            totalDocs,
            limit,
            page,
            totalPages: Math.ceil(totalDocs / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const exportUsers = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string;
        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } }
            ];
        }

        const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

        let csv = 'Name,Email,Role,Joined Date\n';
        users.forEach(user => {
            const joinedDate = new Date(user.createdAt).toLocaleDateString();
            csv += `"${user.name}","${user.email}","${user.role}","${joinedDate}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: "Error exporting users" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
};
