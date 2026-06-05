import multer from "multer";

const storage = multer.diskStorage({
    /*
        Multer support two storage types:
        Storage                 Description
        diskStorage             Save files to server 
        diskmemoryStorage       Store files in RAM (buffer)

    */
    destination: function (req, file, cb) {
      cb(null, "./public/temp") // This means -> Save uploaded file inside { /public/temp }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // This decides what the file name will be after upload.
    }
  })
  
export const upload = multer({ 
    storage, 
}); // This creates a middleware called upload. Middleware means it runs before your controller.

/*

import multer from "multer";
import fs from "fs/promises";

const uploadPath = "./public/temp";

// ensure folder exists
async function ensureDir() {
  try {
    await fs.access(uploadPath);
  } catch {
    await fs.mkdir(uploadPath, { recursive: true });
  }
}
await ensureDir();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // This means -> Save uploaded file inside { /public/temp }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  },
});

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only videos allowed"));
    }
  },
});

*/