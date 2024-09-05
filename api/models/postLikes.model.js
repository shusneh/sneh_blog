import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
   
    postId: {
      type: String,
      required: true,
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const PostLike = mongoose.model('PostLike', postSchema);

export default PostLike;