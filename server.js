import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/database.js";
import Auth from "./routes/auth.js";
dotenv.config();
const PORT = process.env.PORT || 7000;
const app = express();
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
app.use(express.json());
app.use(cookieParser());
connectDB();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//routes Import
app.use("/api/auth", Auth);
//middleware

export default app;
