import express from "express";
import { testConnection } from "./config/db.js";

const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`Server runnning at http://localhost:${port}`);
  testConnection();
});
