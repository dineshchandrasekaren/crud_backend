const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
postSchema.index({ id: 1 });
postSchema.index({ userId: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
