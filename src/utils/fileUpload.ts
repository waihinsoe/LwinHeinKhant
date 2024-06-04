import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { config as myConfig } from "@/config/config";

cloudinary.config({
  cloud_name: myConfig.cloudinaryName,
  api_key: myConfig.cloudinaryApiKey,
  api_secret: myConfig.cloudinaryApiSecret,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage }).array("files", 1);
