import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import ideaRoutes from "./routes/idea.routes";
import adminRoutes from "./routes/admin.routes";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/admin", adminRoutes);

export default app;
