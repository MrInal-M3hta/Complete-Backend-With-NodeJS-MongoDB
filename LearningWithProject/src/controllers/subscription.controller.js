import mongoose, { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// TODO: toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params; // channel user wants to subscribe
  const userId = req.user?._id; // logged-in user

  // validation
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (channelId === userId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  // check if channel exists
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  // check existing subscription
  const existing = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });
/*
  Explaination of this code line:
  const existing = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  How data is Stored?
  My Schema:
    {
        subscriber: ObjectID, // user who is subscribing
        channel: ObjectID // channel being followed
    }

  Example:
    If user1 subscribed to user2, DB stoes:
    {
        subscriber: "user1",
        channel: "user2"
    }

  Now what our query means:
    you are asking MongoDB:
      Is there ANY document where:
        subscriber = this user 
      AND
        channel = this channel
      ?

  Now we have two Possible Outcome:
    case 1 : Document Found
      Result:
          existing = {
            _id: "...",
            subscriber: "user1",
            channel: "user2"
          }
      Meaning: YES -> user already subscribed

    case 2 : Document NOT Found 
      Result:
          existing = null
      DB Does not contain:
          {subscriber: "user1", channel: "user2"}
      Meaning: NO -> user is NOT subscribed
*/

  let isSubscribed;

  if (existing) {
    // unsubscribe
    await Subscription.findByIdAndDelete(existing._id);
    isSubscribed = false;
  } else {
    // subscribe
    await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    isSubscribed = true;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isSubscribed },
        isSubscribed ? "Subscribed successfully" : "Unsubscribed successfully",
      ),
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await User.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.aggregate([
    // 1. Match subscriptions of this channel
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },

    // 2. Join with users collection
    {
      $lookup: {
        from: "users", // collection name
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
      },
    },

    // 3. Convert array → object
    {
      $unwind: "$subscriber",
    },

    // 4. Select only required fields
    {
      $project: {
        _id: 0,
        subscriber: {
          _id: "$subscriber._id",
          username: "$subscriber.username",
          fullName: "$subscriber.fullName",
          avatar: "$subscriber.avatar",
        },
      },
    },
  ]);

  const totalSubscribers = subscribers.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSubscribers,
        subscribers,
      },
      "Subscribers fetched successfully",
    ),
  );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const channels = await Subscription.aggregate([
    // 1. Match subscriptions of this user
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },

    // 2. Join with users (channel info)
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
      },
    },

    // 3. Convert array → object
    {
      $unwind: "$channel",
    },

    // 4. Select required fields
    {
      $project: {
        _id: 0,
        channel: {
          _id: "$channel._id",
          username: "$channel.username",
          fullName: "$channel.fullName",
          avatar: "$channel.avatar",
        },
      },
    },
  ]);

  const totalSubscribed = channels.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSubscribed,
        channels,
      },
      "Subscribed channels fetched successfully",
    ),
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
