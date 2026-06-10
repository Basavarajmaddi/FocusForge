const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const {
  createPost,
  getPosts,
  deletePost,
  likePost,
  dislikePost,
} = require("../controllers/postController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/create", authMiddleware, upload.single("image"), createPost);
router.get("/", getPosts);
router.delete("/:id", authMiddleware, deletePost);
router.put("/like/:id", authMiddleware, likePost);
router.put("/dislike/:id", authMiddleware, dislikePost);

module.exports = router;
