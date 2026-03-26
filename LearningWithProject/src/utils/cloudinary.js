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