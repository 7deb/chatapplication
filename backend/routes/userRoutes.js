const express = require('express');
const { signUp, login, logout, updateProfile, checkAuth } = require('../controller/authController');
const authToken = require('../middleware/middleware');
const authrouter = express.Router();

authrouter.post('/signup', signUp);
authrouter.post('/logout', logout);
authrouter.post('/login', login);

authrouter.put('/update-profile', authToken, updateProfile);
authrouter.get('/check', authToken, async (req, res) => {
    res.json({ user: req.user });
});
module.exports = authrouter;