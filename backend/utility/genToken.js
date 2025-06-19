const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenGenerator = async (userId, res) => {
    const jwtToken = jwt.sign({ userId }, process.env.SECRET, { expiresIn: "1d" });

    res.cookie('token', jwtToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
    });

}

module.exports = tokenGenerator;