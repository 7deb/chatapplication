const bcrypt = require('bcrypt');
const user = require('../models/userModel');
const tokenGenerator = require('../utility/genToken');
const cloudinary = require('../lib/cloudinary');

const signUp = async (req, res) => {
    try {

        const { username, email, password, confirmedPassword } = req.body;
        if (!username || !email || !password || !confirmedPassword) {
            return res.status(400).json({ error: "all fields are necessary" });
        }

        if (password != confirmedPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const existingUser = await user.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user({
            username: username,
            email: email,
            password: hashedPassword,
            profilePic: user.profilePic,
        })

        await newUser.save();
        tokenGenerator(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "internal server error" })
    }
}

const login = async (req, res) => {
    try {
    const { email, password } = req.body;
        if (!email, !password) {
            return res.status(400).json({ error: "all fields are needed" });
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ error: "this user does not exist" });
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password);
        if (!comparePassword) {
            return res.status(400).json({ error: "passwords do not match" });
        }

        tokenGenerator(existingUser._id, res);

        res.status(201).json({
            _id: existingUser._id,
            username: existingUser.username,
            profilePic: existingUser.profilePic,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" });
    }
}
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await user.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("error in update profile:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { signUp, login, logout, updateProfile,checkAuth }