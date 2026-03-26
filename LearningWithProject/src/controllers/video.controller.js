import mongoose, { isValidObjectId } from "mongoose";
import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// ✅ 1. Get All Videos (Search + Pagination + Sort)
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pipeline = [];

  // 🔥 search
  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  // 🔥 filter by user
  if (userId && isValidObjectId(userId)) {
    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  // 🔥 only published
  pipeline.push({
    $match: { isPublished: true },
  });

  // 🔥 sorting
  if (sortBy) {
    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
    pipeline.push({ $sort: sortOptions });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  // 🔥 join owner
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner",
    },
  });

  pipeline.push({ $unwind: "$owner" });

  // 🔥 clean response
  pipeline.push({
    $project: {
      title: 1,
      thumbnail: 1,
      views: 1,
      duration: 1,
      createdAt: 1,
      owner: {
        _id: "$owner._id",
        username: "$owner.username",
        avatar: "$owner.avatar",
      },
    },
  });

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const videos = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});


// ✅ 2. Publish Video
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title & description required");
  }

  const videoPath = req.files?.videoFile?.[0]?.path;
  const thumbnailPath = req.files?.thumbnail?.[0]?.path;

  if (!videoPath || !thumbnailPath) {
    throw new ApiError(400, "Video & thumbnail required");
  }

  const videoUpload = await uploadOnCloudinary(videoPath);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailPath);

  if (!videoUpload?.url || !thumbnailUpload?.url) {
    throw new ApiError(400, "Upload failed");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoUpload.url,
    thumbnail: thumbnailUpload.url,
    duration: videoUpload.duration || 0,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});


// ✅ 3. Get Video By ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username fullName avatar");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});


// ✅ 4. Update Video
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 🔥 ownership check
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  const thumbnailPath = req.file?.path;

  let thumbnailUrl = video.thumbnail;

  if (thumbnailPath) {
    const upload = await uploadOnCloudinary(thumbnailPath);
    thumbnailUrl = upload.url;
  }

  video.title = title || video.title;
  video.description = description || video.description;
  video.thumbnail = thumbnailUrl;

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated"));
});


// ✅ 5. Delete Video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 🔥 ownership check
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted"));
});


// ✅ 6. Toggle Publish Status
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      video,
      `Video ${video.isPublished ? "published" : "unpublished"}`
    )
  );
});

export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus};