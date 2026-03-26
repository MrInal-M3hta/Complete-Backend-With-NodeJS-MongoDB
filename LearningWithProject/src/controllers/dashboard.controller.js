import mongoose from "mongoose";
import Video from "../models/video.model.js";
import Subscription from "../models/subscription.model.js";
import Like from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const channelId = req.user?._id;

  if (!channelId) {
    throw new ApiError(401, "Unauthorized");
  }

  const channelObjectId = new mongoose.Types.ObjectId(channelId);

  // 🔥 total videos + views
  const videoStats = await Video.aggregate([
    {
      $match: { owner: channelObjectId },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        videoIds: { $push: "$_id" },
      },
    },
  ]);

  const totalVideos = videoStats[0]?.totalVideos || 0;
  const totalViews = videoStats[0]?.totalViews || 0;
  const videoIds = videoStats[0]?.videoIds || [];

  // 🔥 total likes
  const totalLikes = await Like.countDocuments({
    video: { $in: videoIds },
  });

  // 🔥 total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelObjectId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalViews,
        totalLikes,
        totalSubscribers,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const channelId = req.user?._id;
  const { page = 1, limit = 10 } = req.query;

  if (!channelId) {
    throw new ApiError(401, "Unauthorized");
  }

  const videos = await Video.find({
    owner: channelId,
    isPublished: true,
  })
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalVideos = await Video.countDocuments({
    owner: channelId,
    isPublished: true,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        page: parseInt(page),
        limit: parseInt(limit),
        videos,
      },
      "Channel videos fetched successfully"
    )
  );
});

export { getChannelStats, getChannelVideos };
