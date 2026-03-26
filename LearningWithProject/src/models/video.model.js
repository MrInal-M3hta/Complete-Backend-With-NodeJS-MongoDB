import mongoose from "mongoose";
import mongooseAggrigatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    videoFile: {
        type: String, // Cloudinary URL of the uploaded video
        required: true,
    },
    thumbnail: {
        type: String, // Cloudinary URL of the uploaded thumbnail image
        required: true,
    },
    duration: {
        type: Number, // Duration of the video in seconds
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

videoSchema.plugin(mongooseAggrigatePaginate)

const Video = mongoose.model("Video", videoSchema);
export default Video;