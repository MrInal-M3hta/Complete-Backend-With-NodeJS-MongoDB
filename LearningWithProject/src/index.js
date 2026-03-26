// require ("dotenv").config({path: "./.env"});
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectToDatabase from "./db/dababase.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`⚙️ Server running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with a failure code
  });