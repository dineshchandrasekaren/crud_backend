const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  fetchAndStorePosts,
} = require("../controllers/post.controller");

router.route("/fetch-and-store").get(fetchAndStorePosts);

router.route("/posts").get(getAllPosts).post(createPost);

router.route("/posts/:id").get(getPostById).put(updatePost).delete(deletePost);

module.exports = router;
