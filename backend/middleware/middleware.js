const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const authToken = async (req, res, next) => {
	try {
		let token = req.cookies.token;
		//console.log("Received token:", token);

		if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1];
		}
		if (!token) {
			return res.status(404).json({ error: "Unauthorized - No Token Provided" });
		}
		const decoded = jwt.verify(token, process.env.SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			console.log('User not found for ID:', decoded.userId);
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: "Unauthorized - Token Expired" });
		} else if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		} else {
			res.status(500).json({ error: "Internal server error" });
		}
	}
};
module.exports = authToken;