import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const allowRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.log(`Access denied. User role: ${req.user?.role}, Required roles: ${roles.join(", ")}`);
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
