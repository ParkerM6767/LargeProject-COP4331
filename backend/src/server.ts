// Main libraries
import express from "express";
import cors from "cors";
import { client } from "./db";

// Express setup/dependencies
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Main routers
import postrouter from "./routes/postRoutes";
app.use("/api/posts", postrouter);
import userrouter from "./routes/userRoutes";
app.use("/api/users", userrouter);

// Disables CORS issues
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );
  next();
});

app.get("/api/hello", async (req, res) => {
  res.status(200).send("Hello World");
});

console.log("Starting backend");
app.listen(8000);
