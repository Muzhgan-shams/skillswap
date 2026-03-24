import { env } from "./config/env";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import listingRoutes from "./routes/listing.routes";

const app = express();
const PORT = env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "Server is healthy!" });
});
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
