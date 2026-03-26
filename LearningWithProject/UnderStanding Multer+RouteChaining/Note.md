## It is a file file path Cloudinary function with DiskStorage Multer
Combine route chaining + Multer + Cloudinary-style controller in a clean, real-world way.

We'll use:
```
/user
```

• **GET** → fetch user<br>
• **POST** → create user with avatar + video upload<br>
• **PUT** → update user (optionally upload new files)

## **uploadToCloudinary Function...**
```js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// 🔹 Configure Cloudinary (use .env values)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file (from local path) to Cloudinary
 * @param {string} filePath - local file path from multer (req.files[].path)
 * @param {string} folder - cloudinary folder name (e.g. "avatars", "videos")
 * @returns {object|null} - cloudinary response or null
 */
export const uploadToCloudinary = async (filePath, folder = "uploads") => {
  try {
    // ❗ if no file, skip
    if (!filePath) return null;

    // 🔹 Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto", // auto-detect image/video/pdf
    });

    // 🔹 Delete local file after upload
    await fs.unlink(filePath);

    return result;

  } catch (error) {
    // 🔹 Cleanup if error occurs
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.error("File delete error:", e.message);
      }
    }

    console.error("Cloudinary upload error:", error.message);
    throw new Error("Failed to upload file to Cloudinary");
  }
};
```

## 1️⃣ Multer Middleware
```js
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
```

## 2️⃣ Controller (with upload logic)
```js
import { uploadToCloudinary } from "../services/cloudinary.service.js";

// GET /user
export const getUser = (req, res) => {
  res.json({ message: "User data fetched" });
};

// POST /user (with files)
export const createUser = async (req, res) => {
  try {

    const avatarPath = req.files?.avatar?.[0]?.path;
    const videoPath = req.files?.video?.[0]?.path;

    const avatar = avatarPath
      ? await uploadToCloudinary(avatarPath, "avatars")
      : null;

    const video = videoPath
      ? await uploadToCloudinary(videoPath, "videos")
      : null;

    res.json({
      message: "User created",
      avatar: avatar?.secure_url,
      video: video?.secure_url,
      bodyData: req.body
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /user (update with optional files)
export const updateUser = async (req, res) => {
  try {

    const avatarPath = req.files?.avatar?.[0]?.path;
    const videoPath = req.files?.video?.[0]?.path;

    let avatar, video;

    if (avatarPath) {
      avatar = await uploadToCloudinary(avatarPath, "avatars");
    }

    if (videoPath) {
      video = await uploadToCloudinary(videoPath, "videos");
    }

    res.json({
      message: "User updated",
      avatar: avatar?.secure_url,
      video: video?.secure_url,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
Note: req.files -> this is created automatically by multer .

## 3️⃣ Route with Chaining + Multer
```js
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getUser, createUser, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/user")

  // GET → no file upload needed
  .get(getUser)

  // POST → upload avatar + video
  .post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "video", maxCount: 1 }
    ]),
    createUser
  )

  // PUT → update user + optional files
  .put(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "video", maxCount: 1 }
    ]),
    updateUser
  );

export default router;
```
## 4️⃣ How It Works (Flow)
```
POST /user
   │
   ▼
Multer Middleware
(upload.fields)
   │
   ▼
Files saved → /public/temp
   │
   ▼
req.files populated
   │
   ▼
Controller (createUser)
   │
   ▼
uploadToCloudinary()
   │
   ▼
Cloudinary URLs returned
```
## POSTMAN EXAMPLE
*POST/user*
form-data
| Key | Type |
| ---- | ---- | 
| avatar | File |
| video | File |
| name | Text |
| email | Text |

### You can attach middleware per methods
```js
router.route("/user")
  .get(getUser)              // no multer
  .post(upload.fields(...), createUser)  // multer used
  .put(upload.fields(...), updateUser);  // multer used
```
👉 Middleware runs only for that method

### This setup means:
```
GET /user        → fetch data
POST /user       → upload avatar + video + create user
PUT /user        → update user + optionally upload new files
```
## Multer creates:
Note
```
req.files
req.body
```
## Quick Difference
| Method | Data | 
| ------ | ---- |
| single() | req.file (Object) |
| array() | req.files (array) |
| fields() | req.files (object of array) |

### Case 1: Using upload.array()
```js
app.post("/upload", upload.array("files", 5), (req, res) => {
  console.log(req.files);
});
```
#### 📥 What req.files looks like
```js
[
  {
    filename: "123-img1.jpg",
    path: "public/temp/123-img1.jpg"
  },
  {
    filename: "124-img2.jpg",
    path: "public/temp/124-img2.jpg"
  }
]
```
#### ✅ Get all file paths
```js
const filePaths = req.files.map(file => file.path);

console.log(filePaths);
```
output:
```json
[
  "public/temp/123-img1.jpg",
  "public/temp/124-img2.jpg"
]
```

### Case 2: Using upload.fields() (IMPORTANT)
```js
upload.fields([
  { name: "videoFile", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
])
```
#### 📥 req.files looks like:
```js
{
  videoFile: [
    {
      path: "public/temp/video.mp4"
    }
  ],
  thumbnail: [
    {
      path: "public/temp/thumb.jpg"
    }
  ]
}
```
#### ✅ Get paths (fields case)
```js
const videoPath = req.files.videoFile[0].path;
const thumbnailPath = req.files.thumbnail[0].path;
```
#### 🔥 Get ALL paths dynamically
```js
const allPaths = [];

Object.values(req.files).forEach(fileArray => {
  fileArray.forEach(file => {
    allPaths.push(file.path);
  });
});

console.log(allPaths);
```

## Difference Between req.body, req.params, and req.query
| Property | Used for | Example | 
| ------ | -------| --------- |
| req.body | Data sent in request body | POST form |
| req.params | URL parameters | /user/:id |
| req.query | Query string | ?page=2 |