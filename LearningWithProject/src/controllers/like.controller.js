import mongoose, { isValidObjectId } from "mongoose";
import Like from "../models/like.model.js";
import Video from "../models/video.model.js";
import Tweet from "../models/tweet.model.js";
import Comment from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// 🔥 Common Toggle Helper (DRY - best practice)
const toggleLike = async ({ field, value, userId }) => {
  const query = { [field]: value, likedBy: userId };

  const existing = await Like.findOne(query);

  if (existing) {
    await Like.findByIdAndDelete(existing._id);
    return false; // unliked
  } else {
    await Like.create({ [field]: value, likedBy: userId });
    return true; // liked
  }
};


// ✅ 1. Toggle Video Like
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const isLiked = await toggleLike({
    field: "video",
    value: videoId,
    userId,
  });

  return res.status(200).json(
    new ApiResponse(200, { isLiked }, isLiked ? "Liked" : "Unliked")
  );
});


// ✅ 2. Toggle Comment Like
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const isLiked = await toggleLike({
    field: "comment",
    value: commentId,
    userId,
  });

  return res.status(200).json(
    new ApiResponse(200, { isLiked }, isLiked ? "Liked" : "Unliked")
  );
});


// ✅ 3. Toggle Tweet Like
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const isLiked = await toggleLike({
    field: "tweet",
    value: tweetId,
    userId,
  });

  return res.status(200).json(
    new ApiResponse(200, { isLiked }, isLiked ? "Liked" : "Unliked")
  );
});


// ✅ 4. Get Liked Videos (Aggregation)
const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $ne: null }, // important fix
      },
    },

    // 🔥 join videos
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    { $unwind: "$video" },

    // 🔥 only published videos
    {
      $match: {
        "video.isPublished": true,
      },
    },

    // 🔥 join owner
    {
      $lookup: {
        from: "users",
        localField: "video.owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    // 🔥 format response
    {
      $project: {
        _id: 0,
        video: {
          _id: "$video._id",
          title: "$video.title",
          thumbnail: "$video.thumbnail",
          views: "$video.views",
          duration: "$video.duration",
          createdAt: "$video.createdAt",
        },
        owner: {
          _id: "$owner._id",
          username: "$owner.username",
          avatar: "$owner.avatar",
        },
      },
    },

    { $sort: { "video.createdAt": -1 } },
  ]);

  return res.status(200).json(
    new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
  );
});

export {toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos};