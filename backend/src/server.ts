import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
// app.use(bodyParser);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

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
