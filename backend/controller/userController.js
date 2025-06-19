const User = require("../models/userModel");
const Message = require("../models/messageModel");

const getusersforSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    const usersWithLastMessage = await Promise.all(
      allUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...user.toObject(),
          lastMessage: lastMessage
            ? {
                text: lastMessage.text || "",
                image: lastMessage.image || "",
                createdAt: lastMessage.createdAt,
              }
            : null,
        };
      })
    );

    // Step 3: Return to frontend
    res.status(200).json({ filteredUser: usersWithLastMessage });
  } catch (error) {
    console.log("Error in getusersforSideBar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getusersforSideBar;
