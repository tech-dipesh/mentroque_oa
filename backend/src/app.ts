import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { availabilityRouter } from "./modules/availability/availability.routes.js";
import { requestRouter } from "./modules/matching/request.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { meetingsRouter } from "./modules/meetings/meetings.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/requests", requestRouter);
app.use("/api/admin", adminRouter);
app.use("/api/meetings", meetingsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
