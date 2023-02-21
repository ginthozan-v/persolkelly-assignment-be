import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import employeesRoutes from "./routes/employees.js";
import cafesRoutes from "./routes/cafes.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("App is running!");
});

app.use("/api/employees", employeesRoutes);
app.use("/api/cafes", cafesRoutes);

// mongodb
const PORT = process.env.PORT;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`🟢 Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(`❌ ${error.message}`));
