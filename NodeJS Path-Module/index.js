import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public"))); 
    
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "public", "index.html");
    res.sendFile(filePath);

    const absolutePath = path.resolve("public", "index.html");
    console.log("Absolute Path:", absolutePath);
});

app.get("/path-info", (req, res) => {
    const filePath = path.join(__dirname, "public", "index.html");
    const pathInfo = {
        baseName: path.basename(filePath),
        dirName: path.dirname(filePath),
        extName: path.extname(filePath),
        isAbsolute: path.isAbsolute(filePath),
        normalizedPath: path.normalize(filePath)
    };
    res.json(pathInfo);
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to the Path Module API");
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});