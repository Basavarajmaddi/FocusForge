const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      title,
      content,
      image,
      user: req.user.id,
    });

    const populatedPost = await Post.findById(post._id).populate("user", "name email avatar");

    res.json(populatedPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email avatar").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;
    if (!post.likes) post.likes = [];

    const alreadyLiked = (post.likes || []).some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
      post.dislikes = post.dislikes?.filter((id) => id.toString() !== userId) || [];
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    if (!post.dislikes) post.dislikes = [];

    const alreadyDisliked = (post.dislikes || []).some((id) => id.toString() === userId);

    if (alreadyDisliked) {
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes?.filter((id) => id.toString() !== userId) || [];
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  likePost,
  dislikePost,
};
