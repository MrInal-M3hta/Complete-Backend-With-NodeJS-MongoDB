import mongoose, { isValidObjectId } from "mongoose";
import Tweet from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  const createdTweet = await Tweet.findById(tweet._id).populate(
    "owner",
    "username fullName avatar",
    // .populate("owner").select("username fullName avatar")
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets and likes
  const { userId } = req.params;
  const currentUserId = req.user._id;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const tweets = await Tweet.aggregate([
    // 1. Match tweets of this user
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },

    // 2. Lookup likes
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },

    // 3. Add like count + isLiked
    {
      $addFields: {
        totalLikes: { $size: "$likes" },

        isLiked: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(currentUserId),
                "$likes.likedBy",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },

    // 4. Lookup owner (user)
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    // 5. Clean response
    {
      $project: {
        content: 1,
        createdAt: 1,
        totalLikes: 1,
        isLiked: 1,
        owner: {
          _id: "$owner._id",
          username: "$owner.username",
          avatar: "$owner.avatar",
        },
      },
    },

    // 6. Sort latest first
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, tweets, "User tweets fetched successfully")
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // 🔥 Ownership check
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own tweets");
  }

  tweet.content = content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // 🔥 Ownership check
  if (tweet.owner.toString() !== req.user._id.toString()) {
    // Why we use .toString() method because "They are objects, not primitive values".
    throw new ApiError(403, "You can only delete your own tweets");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
