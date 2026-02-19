import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ProjectIdea } from "../models/projectIdea.model";

export const getSystemStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalIdeas = await ProjectIdea.countDocuments();
        const pendingIdeas = await ProjectIdea.countDocuments({ status: "pending" });
        const approvedIdeas = await ProjectIdea.countDocuments({ status: "approved" });

        res.status(200).json({
            totalUsers,
            totalIdeas,
            pendingIdeas,
            approvedIdeas,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching system stats", error });
    }
};

export const getGrowthStats = async (req: Request, res: Response) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);

        const projectGrowth = await ProjectIdea.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);

        // Helper to get month name
        const getMonthName = (monthNum: number) => {
            const date = new Date();
            date.setMonth(monthNum - 1);
            return date.toLocaleString('default', { month: 'short' });
        };

        // Merge and format data
        const months = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - 5 + i);
            months.push(d.getMonth() + 1);
        }

        const formattedGrowth = months.map(month => {
            const userStat = userGrowth.find(u => u._id === month);
            const projectStat = projectGrowth.find(p => p._id === month);
            return {
                date: getMonthName(month),
                users: userStat?.count || 0,
                ideas: projectStat?.count || 0
            };
        });

        res.status(200).json(formattedGrowth);
    } catch (error) {
        res.status(500).json({ message: "Error fetching growth stats", error });
    }
};
