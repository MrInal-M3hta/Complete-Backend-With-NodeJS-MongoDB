// console.log("Backend Learning");
require("dotenv").config();

const express = require("express"); //It is a commonjs module, so we use require to import it

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create-file", (req, res) => {
  // Logic to create a file goes here
  res.send("File created successfully!");
});

app.put("/update-file", (req, res) => {
  // Logic to update a file goes here
  res.send("File updated successfully!");
});

app.delete("/delete-file", (req, res) => {
  // Logic to delete a file goes here
  res.send("File deleted successfully!");
});

app.get("/twitter", (req, res) => {
  // Logic to fetch Twitter data goes here
  res.send("Twitter data fetched successfully!");
});

app.get("/log-in", (req, res) => {
  res.send("<h1>Log in successful!</h1>");
});

app.get("/json", (req, res) => {
  res.json({ message: "This is a JSON response" });
});

// Middleware example: Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware or route handler
}); // This middleware will log every incoming request to the console with a timestamp, HTTP method, and URL.

app.use("/api", (req, res, next) => {
  console.log("API middleware triggered", req.url, req.method);
  // res.send("Middleware")
  next();
}); // This middleware will be triggered for all routes starting with /api

app.use("/api", (req, res, next)=>{
  console.log("Another Midlleware",req.url, req.method)
  res.send("Another Middleware")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});