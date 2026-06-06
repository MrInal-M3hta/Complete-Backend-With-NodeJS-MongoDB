import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the File System API");
});

app.get("/read-file", (req, res) => {
    fs.readFile("./public/hello.txt", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading file");
        } else {
            res.send(data);
        }
    });
});

app.post("/write-file", (req, res) => {
    fs.writeFile("./public/hello.txt", "Hello, World!", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error writing file");
        } else {
            res.send("File written successfully");
        }
    });
});

app.get("/append-file", (req, res) => {
    fs.appendFile("./public/hello.txt", "\nAppended text, to hello.txt", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error appending to file");
        } else {
            res.send("Text appended successfully");
        }
    });
});

app.delete("/delete-file", (req, res) => {
    fs.unlink("./public/hello.txt", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error deleting file");
        } else {
            res.send("File deleted successfully");
        }
    });
});

app.put("/rename-file", (req, res) => {
    fs.rename("./public/hello.txt", "./public/new-hello.txt", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error renaming file");
        } else {
            res.send("File renamed successfully");
        }
    });
});

app.get("/stream-file", (req, res) => {
    const readStream = fs.createReadStream("./public/hello.txt", "utf8");

    readStream.on("error", (err) => {
        console.error(err);
        res.status(500).send("Error streaming file");
    });
    readStream.on("open", () => {
        readStream.pipe(res);
    });
});

app.get("/read-folder", (req, res) => {
    fs.readdir("./public", (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading folder");
        } else {
            res.send(files);
        }
    });
});

app.post("/create-folder", (req, res) => {
    fs.mkdir("./public/new-folder", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error creating folder");
        } else {
            res.send("Folder created successfully");
        }
    });
});

app.put("/rename-folder", (req, res) => {
    fs.rename("./public/new-folder", "./public/renamed-folder", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error renaming folder");
        } else {
            res.send("Folder renamed successfully");
        }
    });
});

                        /*       Read PDF file      */
app.get("/read-pdf-file", (req, res) => {
   fs.readFile("./public/sample.pdf", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading PDF file");
        } else {
            res.setHeader("Content-Type", "application/pdf");
            res.send(data);
        }
    });
});

app.get("/read-heavy-pdf", (req, res) => {
  const pdfStream = fs.createReadStream("./public/sample.pdf");

  res.setHeader("Content-Type", "application/pdf");

  pdfStream.on("error", (err) => {
    console.error("PDF stream error:", err);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to stream PDF",
      });
    }

    res.end();
  });

  pdfStream.pipe(res);
});

                        /*       Read JSON file      */
app.get("/read-json-file", (req, res) => {
    fs.readFile("./public/data.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading JSON file");
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (parseErr) {
                console.error(parseErr);
                res.status(500).send("Error parsing JSON file");
            }
        }
    });
});

app.get("/stream-json-file", (req, res) => {
    const jsonStream = fs.createReadStream("./public/data.json", "utf8");

    res.setHeader("Content-Type", "application/json");

    jsonStream.on("error", (err) => {
        console.error("JSON stream error:", err);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Unable to stream JSON",
            });
        }

        res.end();
    });

    jsonStream.pipe(res);
});

                    /*       Write JSON File      */   

app.post("/write-json-file", (req, res) => {
    const jsonData = {
        name: " Luffy",
        age: 19,
        city: " Foosha Village ",
    };

    fs.writeFile("./public/data.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error writing JSON file");
        } else {
            res.send("JSON file written successfully");
        }
    });
});

app.post("/append-user", (req, res) => {
  const newUser = {
    name: "Zoro",
    age: 21,
  };

  fs.readFile("./public/data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to read file");
    }

    let users = [];

    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      console.error(parseErr);
      return res.status(500).send("Invalid JSON file");
    }

    users.push(newUser);

    fs.writeFile(
      "./public/data.json",
      JSON.stringify(users, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Failed to write file");
        }

        res.send("User added");
      }
    );
  });
});

                        /*       Read Image      */

app.get("/read-image", (req, res) => {
    fs.readFile("./public/cat.jpg", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading image");
        } else {
            res.setHeader("Content-Type", "image/jpeg");
            res.send(data);
        }
    });
});

app.get("/image", (req, res) => {
  const stream = fs.createReadStream("./public/cat.jpg");

  res.setHeader("Content-Type", "image/jpeg");

  stream.pipe(res);

  stream.on("error", (err) => {
    console.error(err);
    res.status(500).send("Error streaming image");
  });
});

                        /* Read video file */

app.get("/read-video", (req, res) => {
    fs.readFile("./public/sample.mp4", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading video");
        } else {
            res.setHeader("Content-Type", "video/mp4");
            res.send(data);
        }
    });
});

app.get("/video", (req, res) => {
  const stream = fs.createReadStream("./public/sample.mp4");

  res.setHeader("Content-Type", "video/mp4");

  stream.pipe(res);

  stream.on("error", (err) => {
    console.error(err);
    res.status(500).send("Error streaming video");
  });
});

                        /* File information */

app.get("/file-info", (req, res) => {
    fs.stat("./public/hello.txt", (err, stats) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting file info");
        } else {
            res.json({
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
            });
        }
    });
});

// Check if file exists or not

app.get("/check-file", (req, res) => {
  fs.access("./public/hello.txt", fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File does not exist");
    }

    return res.status(200).send("File exists");
  });
});

/*
import fs from "fs/promises";

app.get("/check-file", async (req, res) => {
  try {
    await fs.access("./public/hello.txt");

    return res.status(200).json({
      success: true,
      message: "File exists",
    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "File does not exist",
    });
  }
});
*/

app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})
