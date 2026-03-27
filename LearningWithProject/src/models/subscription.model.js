import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // One who is subscribing OR user who subscribes 
      ref: "User",
      index: true
    },
    channel: {
      type: Schema.Types.ObjectId, // One to whom 'subscriber' is subscribing OR channel being followed
      ref: "User",
      index: true
    },
  },
  { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;


