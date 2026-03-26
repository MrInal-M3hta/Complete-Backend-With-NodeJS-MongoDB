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