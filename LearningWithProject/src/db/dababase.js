import mongoose from "mongoose";
import { BD_NAME } from "../constant.js";

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${BD_NAME}`);
    console.log(`Connected to MongoDB successfully! \nDB Name: ${connection.connection.name} \nHost: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

export default connectToDatabase;