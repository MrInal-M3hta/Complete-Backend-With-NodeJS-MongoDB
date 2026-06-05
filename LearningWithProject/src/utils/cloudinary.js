import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import path from "path"

  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);

        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        console.error("Upload failed:",error);
        return null;
    }
};

export const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop();
  const folder = parts.slice(parts.indexOf("upload") + 2).join("/");

  return `${folder}/${fileName.split(".")[0]}`;
};

export {uploadOnCloudinary};


/*
This version expects a file path that already exists on disk.
Example:
    "/public/temp/avatar.png"

So the flow is:
    User Upload
        ↓
    Multer saves file to disk -> public/temp
        ↓
    You get file path -> req.file.path 
        ↓
    uploadOnCloudinary(localFilePath)
        ↓
    Upload to Cloudinary
        ↓
    Delete local file

Example Multer config for this:
    const storage = multer.diskStorage({
    destination: "public/temp",
    filename: (req,file,cb)=>{
    cb(null,file.originalname)
    }
    })

Then:
    req.file.path
is passed to Cloudinary.

Example usage
    const result = await uploadOnCloudinary(req.file.path)

*/

    
/********* fs/promise Version ***********/
// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs/promises"

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// /*
//  * Upload a file (from local path) to Cloudinary
//  * @param {string} filePath - local file path from multer (req.files[].path)
//  * @param {string} folder - cloudinary folder name (e.g. "avatars", "videos")
//  * @returns {object|null} - cloudinary response or null
// */

// export const uploadToCloudinary = async (filePath, folder = "uploads") => {
//   try {
//     // ❗ if no file, skip
//     if (!filePath) return null;

//     // 🔹 Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder,
//       resource_type: "auto", // auto-detect image/video/pdf
//     });

//     // 🔹 Delete local file after upload
//     await fs.unlink(filePath);

//     return result;

//   } catch (error) {
//     // 🔹 Cleanup if error occurs
//     if (filePath) {
//       try {
//         await fs.unlink(filePath);
//       } catch (e) {
//         console.error("File delete error:", e.message);
//       }
//     }

//     console.error("Cloudinary upload error:", error.message);
//     throw new Error("Failed to upload file to Cloudinary");
//   }
// };

// export const deleteFromCloudinary = async (publicId) => {
//   return await cloudinary.uploader.destroy(publicId);
// };

// export const getPublicIdFromUrl = (url) => {
//   const parts = url.split("/");
//   const fileName = parts.pop();
//   const folder = parts.slice(parts.indexOf("upload") + 2).join("/");

//   return `${folder}/${fileName.split(".")[0]}`;
// };
