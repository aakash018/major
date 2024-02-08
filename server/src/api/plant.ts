import axios from "axios";
import express from "express";
import multer from "multer";

import { validateUser } from "../middleware/validateUser";
import FormData from "form-data";
import fs from "fs";
import { generateRandomCode } from "../utils/randomCode";
import { uploadFileToS3 } from "../utils/s3Bucket";
import { prisma } from "../server";
const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

// Example route to handle photo upload from React using multer
router.post(
  "/upload",
  validateUser,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.json({
          status: "fail",
          message: "empty request",
        });
      }
      const photoBuffer = req.file.buffer as Buffer & Blob;

      // Create a FormData object to append the file
      const form = new FormData();

      // Append the photo to the FormData object
      form.append("file", photoBuffer, "uploaded_photo.jpg");

      // Make a request to the FastAPI server with the FormData object
      const response = await axios.post(
        "http://localhost:8000/api/upload",
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );
      const id = generateRandomCode();
      // Send the FastAPI server's response back to the client
      const result = fs.readFileSync("result.png");
      const originalImgKey = `uploaded-original/${Date.now().toString()}-${id}- ${
        req.file.originalname
      }`;
      const UnetImageKey = `uploaded-unet/${Date.now().toString()}-${id}.png`;

      await uploadFileToS3(originalImgKey, req.file.buffer);
      await uploadFileToS3(UnetImageKey, result);

      const bucketName = process.env.BUCKET_NAME;

      const originalImgURL = `https://s3.tebi.io/${bucketName}/${encodeURIComponent(
        originalImgKey
      )}`;
      const UnetImgURL = `https://s3.tebi.io/${bucketName}/${encodeURIComponent(
        UnetImageKey
      )}`;

      await prisma.plant.create({
        data: {
          imageURL: originalImgURL,
          name: req.body.name,
          unetURL: UnetImgURL,
          disease: response.data.disease,
          confidence: response.data.confidence,
          user: {
            connect: {
              id: req.decoded.userId,
            },
          },
        },
      });

      return res.json({
        status: "ok",
        message: "Photo uploaded successfully!",
        fastapiResponse: response.data,
      });
    } catch (error) {
      console.error("Error uploading photo to FastAPI server:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/getPlants", validateUser, async (req, res) => {
  try {
    const plants = await prisma.plant.findMany({
      where: {
        userId: req.decoded.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        imageURL: true,
        id: true,
        name: true,
        createdAt: true,
        disease: true,
      },
    });
    res.json({
      status: "ok",
      message: "plants found",
      plants,
    });
  } catch {
    res.json({
      status: "fail",
      message: "error retrieving data",
    });
  }
});

router.get("/getOnePlant", validateUser, async (req, res) => {
  const { id } = req.query as { id: string };
  if (!id) {
    return res.json({
      status: "fail",
      message: "no id",
    });
  }
  try {
    const plantInfo = await prisma.plant.findFirst({
      where: {
        id,
        userId: req.decoded.userId,
      },
    });

    if (plantInfo) {
      return res.json({
        status: "ok",
        message: "plant found",
        plant: plantInfo,
      });
    } else {
      return res.json({
        status: "fail",
        message: "failed to find plant",
      });
    }
  } catch {
    return res.json({
      status: "fail",
      message: "server failure",
    });
  }
});

router.get("/getDashInfo", validateUser, async (req, res) => {
  try {
    const totalPlants = await prisma.plant.findMany({
      where: {
        userId: req.decoded.userId,
      },
    });

    const totalPlantCount = totalPlants.length;

    const latestPlant = await prisma.plant.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: req.decoded.userId,
      },
    });

    res.json({
      status: "ok",
      message: "data found",
      totalPlantCount,
      recentPlant: latestPlant[0],
    });
  } catch {
    res.json({
      status: "ok",
      message: "failed to get data",
    });
  }
});

router.get("/getPlantByMonth", validateUser, async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
    CAST(EXTRACT(MONTH FROM "createdAt") AS INTEGER)::INT AS month, 
    COUNT(*)::INT AS count
    FROM "Plant"
    WHERE EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM "createdAt") = EXTRACT(MONTH FROM CURRENT_DATE)
    AND "userId" = ${req.decoded.userId}
    GROUP BY month
    `;

    res.json({
      status: "ok",
      message: "data found",
      plantByMonth: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "fail",
      message: "server error",
    });
  }
});

export default router;
