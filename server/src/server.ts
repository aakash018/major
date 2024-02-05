import express from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import auth from "./api/auth";
import plant from "./api/plant";
import axios from "axios";

const app = express();
const PORT = process.env.PORT;

export const prisma = new PrismaClient();

const corsOptions = {
  origin: [process.env.CLIENT_ENDPOINT, "http://192.168.210.142:5173"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.get("/", async (_, res) => {
  res.json({
    Hello: "World",
  });
});

app.get("/api/express", async (req, res) => {
  try {
    // Make a request to the FastAPI server
    const response = await axios.get("http://localhost:8000");

    // Send the FastAPI server's response back to the client
    res.json({
      message: "Hello from Express API!",
      fastapiResponse: response.data,
    });
  } catch (error) {
    console.error("Error calling FastAPI server:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/auth", auth);
app.use("/plant", plant);

app.listen(PORT, () => {
  console.log("SERVER IS RUNNING AT", PORT);
});
