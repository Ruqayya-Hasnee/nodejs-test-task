const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// register user
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // checking if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }
        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({
            message: "Successfully registered",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

//login user
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Email not found");

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send("Invalid password");

        if (user.status === "rejected") {
            return res.status(403).send("Your account has been rejected by admin");
        }

        if (user.status !== "approved") {
            return res.status(403).send("Verify your account from admin");
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.TOKEN_SECRET
        );

        res.header("auth-token", token).send(token);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;