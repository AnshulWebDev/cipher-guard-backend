import express from "express";
require("dotenv").config();
import cookieParser from "cookie-parser";
import cors from "cors";
import database from "./config/database";

const PORT = process.env.PORT || 7000;
const app = express();
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
app.use(express.json());
app.use(cookieParser());
database.connect();
app.use(
  cors({
    origin: "http://localhost:6000",
    credentials: true,
  })
);

//routes Import

//middleware

module.exports = app;
