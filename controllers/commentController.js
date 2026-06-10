const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const comment = await Comment.create({
      postId,
      text,
      user: req.user.id,
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email")
      .populate("replies.user", "name email");
      
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("user", "name email")
      .populate("replies.user", "name email");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    await comment.deleteOne();
    res.json(req.params.id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReply = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ text, user: req.user.id });
    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email")
      .populate("replies.user", "name email");
      
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const replyIndex = comment.replies.findIndex((r) => r._id.toString() === replyId);
    if (replyIndex === -1) return res.status(404).json({ message: "Reply not found" });

    if (comment.replies[replyIndex].user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    comment.replies.splice(replyIndex, 1);
    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email")
      .populate("replies.user", "name email");
      
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  addReply,
  deleteReply,
};
