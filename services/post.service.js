const axios = require("axios");
const Post = require("../models/post.model.js");
const ApiError = require("../utils/ApiError.js");

const JSON_PLACEHOLDER_API = "https://jsonplaceholder.typicode.com/posts";

const postService = {
  async fetchAndStorePosts() {
    const existingPosts = await Post.find();
    console.log("Existing posts count:", existingPosts.length);

    if (existingPosts.length > 0) {
      return existingPosts;
    }

    console.log("Fetching posts from JSONPlaceholder...");
    const response = await axios.get(JSON_PLACEHOLDER_API);
    console.log("JSONPlaceholder response status:", response.status);

    if (!response.data || !Array.isArray(response.data)) {
      throw new ApiError(500, "Failed to fetch data from external API.");
    }

    console.log("Inserting posts into database...");
    const posts = response.data.map((post) => ({
      id: post.id,
      userId: post.userId,
      title: post.title,
      body: post.body,
    }));

    await Post.insertMany(posts);
    console.log("Posts inserted successfully");

    const storedPosts = await Post.find().sort({ id: 1 });
    console.log("Stored posts count:", storedPosts.length);

    return storedPosts;
  },

  async getAllPosts() {
    const posts = await Post.find().sort({ id: 1 });

    if (posts.length > 0) {
      return posts;
    }

    const response = await axios.get(JSON_PLACEHOLDER_API);

    if (!response.data || !Array.isArray(response.data)) {
      throw new ApiError(500, "Failed to fetch data from external API.");
    }

    await Post.insertMany(response.data);
    return await Post.find().sort({ id: 1 });
  },

  async createPost(postData) {
    const { userId, title, body } = postData;
    if (!userId || !title || !body) {
      throw new ApiError(400, "All fields (userId, title, body) are required.");
    }

    // First create in JSONPlaceholder
    console.log("Creating post in JSONPlaceholder");
    const response = await axios.post(JSON_PLACEHOLDER_API, {
      userId,
      title,
      body,
    });

    if (!response.data) {
      throw new ApiError(500, "Failed to create post in external API.");
    }

    console.log("JSONPlaceholder response:", response.data);

    // Check if post with this ID already exists
    const existingPost = await Post.findOne({ id: response.data.id });
    if (existingPost) {
      console.log("Post with ID already exists, generating new ID");
      // Find the highest ID in our database and increment by 1
      const lastPost = await Post.findOne().sort({ id: -1 });
      const newId = lastPost ? lastPost.id + 1 : 1;
      response.data.id = newId;
    }

    // Then create in our database using the ID from JSONPlaceholder or new generated ID
    const newPost = await Post.create({
      id: response.data.id,
      userId,
      title,
      body,
    });

    console.log("Created post in DB:", newPost);
    return newPost;
  },

  async getPostById(id) {
    const post = await Post.findOne({ id });
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    return post;
  },

  async updatePost(id, updateData) {
    console.log("Updating post:", { id, updateData });

    const { userId, title, body } = updateData;
    if (!userId || !title || !body) {
      console.log("Validation failed:", { userId, title, body });
      throw new ApiError(400, "All fields (userId, title, body) are required.");
    }

    // Check if post exists in our DB
    let post = await Post.findOne({ id });
    console.log("Existing post in DB:", post);

    if (!post) {
      throw new ApiError(404, "Post not found in database");
    }

    try {
      // Try to update in JSONPlaceholder (this might fail as it's a mock API)
      try {
        console.log("Attempting to update in JSONPlaceholder");
        const jsonResponse = await axios.put(`${JSON_PLACEHOLDER_API}/${id}`, {
          id,
          userId,
          title,
          body,
        });
        console.log("JSONPlaceholder response:", jsonResponse.data);
      } catch (error) {
        // Log the error but continue with local update
        console.log(
          "JSONPlaceholder update failed (expected for mock API):",
          error.message
        );
      }

      // Update in our database regardless of JSONPlaceholder result
      console.log("Updating post in DB");
      const updatedPost = await Post.findOneAndUpdate(
        { id },
        { userId, title, body },
        { new: true }
      );
      console.log("Updated post in DB:", updatedPost);

      if (!updatedPost) {
        throw new ApiError(500, "Failed to update post in database.");
      }

      return updatedPost;
    } catch (error) {
      console.error("Update failed:", error.message);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        `Failed to update post in database: ${error.message}`
      );
    }
  },

  async deletePost(id) {
    const response = await axios.delete(`${JSON_PLACEHOLDER_API}/${id}`);
    if (response.status !== 200) {
      throw new ApiError(500, "Failed to delete post from external API.");
    }

    const deletedPost = await Post.findOneAndDelete({ id });
    if (!deletedPost) {
      throw new ApiError(404, "Post not found");
    }

    return deletedPost;
  },
};

module.exports = postService;
