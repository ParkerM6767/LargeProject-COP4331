import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
// app.use(bodyParser);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/api/hello", (req, res) => {
  res.status(200).send("Hello World");
});

app.listen(8000);
