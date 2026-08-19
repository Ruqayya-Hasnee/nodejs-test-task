const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Post = require("../models/Post");

const router = express.Router();

//create user
router.post("/users", auth, admin, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }
        //password hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user by admin
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: "user",
            status: "approved",
        });
        //save user after createing
        await user.save();

        res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//get all users
router.get("/users", auth, admin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//approve or reject user
router.patch("/users/:id/status", auth, admin, async (req, res) => {
    try {
        const { status } = req.body;
        if (status !== "approved" && status !== "rejected") {
            return res.status(400).send("Status must be approved or rejected");
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.role === "admin") {
            return res.status(403).send("Cannot modify another admin");
        }
        user.status = status;

        await user.save();
        res.json({
            message: `User ${status} successfully`,
            user,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//delete user
router.delete("/users/:id", auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.role === "admin") {
            return res.status(403).send("Cannot delete another admin");
        }

        await user.deleteOne();

        res.json({
            message: "User deleted successfully",
            user,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// approve post
router.patch("/posts/:id/approve", auth, admin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (post.status !== "pending") {
            return res.status(400).send("Only pending posts can be approved");
        }

        //setting status to published
        post.status = "published";

        await post.save();

        res.json({
            message: "Post approved successfully",
            post,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;