import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ProjectIdea } from "../models/projectIdea.model";

export const getSystemStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalFounders = await User.countDocuments({ role: "founder" });
        const totalAdmins = await User.countDocuments({ role: "admin" });

        const totalProjects = await ProjectIdea.countDocuments();
        const pendingProjects = await ProjectIdea.countDocuments({ status: "pending" });
        const approvedProjects = await ProjectIdea.countDocuments({ status: "approved" });
        const rejectedProjects = await ProjectIdea.countDocuments({ status: "rejected" });

        res.status(200).json({
            users: {
                total: totalUsers,
                founders: totalFounders,
                admins: totalAdmins,
            },
            projects: {
                total: totalProjects,
                pending: pendingProjects,
                approved: approvedProjects,
                rejected: rejectedProjects,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching system stats", error });
    }
};

export const getGrowthStats = async (req: Request, res: Response) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userGrowth = await User.aggregate([
            {
                $match: { createdAt: { $gte: sixMonthsAgo } },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);

        const projectGrowth = await ProjectIdea.aggregate([
            {
                $match: { createdAt: { $gte: sixMonthsAgo } },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);

        res.status(200).json({
            userGrowth,
            projectGrowth,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching growth stats", error });
    }
};
