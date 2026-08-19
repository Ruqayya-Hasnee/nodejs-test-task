const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

//create post
router.post("/", auth, async (req, res) => {
    try {
        const { title, content, status } = req.body;
        if (status !== "draft" && status !== "pending") {
            return res.status(400).send("Status must be draft or pending");
        }
        const post = new Post({
            title,
            content,
            author: req.user._id,
            status,
        });

        await post.save();

        res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//get all posts
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "name email");
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//update post (title, content or status)
router.patch("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (post.author.toString() !== req.user._id) {
            return res.status(403).send("Not authorized to update this post");
        }

        if (post.status === "published") {
            return res.status(400).send("Cannot update a published post");
        }

        const { title, content, status } = req.body;

        if (status !== undefined) {
            if (status !== "draft" && status !== "pending") {
                return res.status(400).send("Status must be draft or pending");
            }
            post.status = status;
        }

        if (title !== undefined) {
            post.title = title;
        }

        if (content !== undefined) {
            post.content = content;
        }

        await post.save();

        res.json({
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;