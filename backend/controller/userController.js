const User = require("../models/userModel");

const getusersforSideBar = async (req,res)=>{
    try {
        const loggedinUser = req.user._id;

        const filteredUser = await User.find({_id:{$ne:loggedinUser} }).select('-password');

        res.status(200).json({filteredUser});
    } catch (error) {        
        console.log("Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = getusersforSideBar;