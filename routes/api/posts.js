const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route     POST api/posts
// @desc                     Create a Post
// @access    Private
router.post(
  "/",
  [auth, [check("text", "text is Required!!").not().isEmpty()]],
  async (req, res) => {
    // res.send("ok");
    //                 Error Checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //               User: User Model
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

// @route     Get api/posts
// @desc                        Get all Posts
// @access    Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

// @route     Get api/posts/:id

// @desc                       Get  Post by Id..

// @access    Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).sort({ date: -1 });

    //                  if no post Match!
    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);

    //                  Custom Error for Invalid id Input
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Invalid PostId" });
    }
    res.status(500).send("server Error");
  }
});

// @route   Delete api/posts/:id

// @desc                          Delete a Post

// @access   Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //                  if no post Match!
    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!" });
    }

    //                  Check if User owns the Post....
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User NOt Authorized" });
    }
    await post.remove();
    res.json({ msg: "Post Removed!" });
  } catch (err) {
    console.error(err.message);

    //                 Custom Error for Invalid id Input
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Invalid PostId" });
    }
    res.status(500).send("server Error");
  }
});

// @route   PUT api/posts/like/:id

// @desc                    Like a Post (if I Like A Post..)

// @access   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    //                  The Post..
    const post = await Post.findById(req.params.id);

    //TODO:          Check if Already Liked. By the AUth User
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already Liked" });
    }
    //                        Like.
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
    //
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

// @route   PUT api/posts/unlike/:id

// @desc                    UNLike a Post (if I Like A Post..)

// @access   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    //                  The Post..
    const post = await Post.findById(req.params.id);

    //TODO:          Check if Already Liked. By the AUth User
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been Liked" });
    }
    //                   Get Remove Index From Array & SPlice
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

// @route     POST api/posts/comment/:id
// @desc                     Create a Comment to the Post
// @access    Private
router.put(
  "/comment/:id",
  [auth, [check("text", "text is Required!!").not().isEmpty()]],
  async (req, res) => {
    //                 Error Checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //               User: User Model
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //              Finding The Post
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // If No Comment Found..
    if (!comment) {
      return res.status(404).json({ msg: "Invalid Comment Id" });
    }
    // Check Owner of Comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "You Not Authorized" });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});
module.exports = router;
