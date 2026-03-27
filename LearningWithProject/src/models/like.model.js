import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true // Add Index for performance
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        index: true // Add Index for performance
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        index: true // Add Index for performance
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true // Add Index for performance
    },
    
}, {timestamps: true})

const Like = mongoose.model("Like", likeSchema);
export default Like;