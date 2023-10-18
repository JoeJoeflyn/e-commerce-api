import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(">>>> file", file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    console.log(">>>> file s", file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: { fieldSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadMemoryStorage = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 5 * 1024 * 1024 },
});
