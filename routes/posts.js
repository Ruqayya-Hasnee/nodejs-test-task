const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

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

module.exports = router;