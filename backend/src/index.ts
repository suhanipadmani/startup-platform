import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./utils/socket";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);
initSocket(server);

connectDB();

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
