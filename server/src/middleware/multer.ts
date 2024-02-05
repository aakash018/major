import multer from "multer";

export const uploadFileToMulter = multer({
  storage: multer.memoryStorage(), // Store the file in memory
});
