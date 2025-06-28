const postService = require("../services/post.service.js");
const ApiResponse = require("../utils/ApiResponse.js");

const fetchAndStorePosts = async (req, res) => {
  try {
    const posts = await postService.fetchAndStorePosts();
    return res
      .status(201)
      .json(
        new ApiResponse(201, posts, "Successfully fetched and stored posts.")
      );
  } catch (error) {
    console.error("Error in fetchAndStorePosts:", error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal server error"
        )
      );
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    return res
      .status(200)
      .json(new ApiResponse(200, posts, "Posts retrieved successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Failed to get posts"
        )
      );
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = await postService.createPost(req.body);
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newPost,
          "Post created successfully in both API and database."
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Failed to create post"
        )
      );
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(parseInt(req.params.id));
    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post retrieved successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Failed to get post"
        )
      );
  }
};

const updatePost = async (req, res) => {
  try {
    const updatedPost = await postService.updatePost(
      parseInt(req.params.id),
      req.body
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPost,
          "Post updated successfully in both API and database."
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Failed to update post"
        )
      );
  }
};

const deletePost = async (req, res) => {
  try {
    const deletedPost = await postService.deletePost(parseInt(req.params.id));
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedPost,
          "Post deleted successfully from both API and database."
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Failed to delete post"
        )
      );
  }
};

module.exports = {
  fetchAndStorePosts,
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
};
