const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addComment,
  getComments,
  deleteComment,
  addReply,
  deleteReply,
} = require("../controllers/commentController");

router.get("/post/:postId", getComments);
router.post("/create", authMiddleware, addComment);
router.delete("/:id", authMiddleware, deleteComment);
router.post("/reply/:id", authMiddleware, addReply);
router.delete("/reply/:commentId/:replyId", authMiddleware, deleteReply);

module.exports = router;
