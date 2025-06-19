const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { getIO, getReceiverSocketId } = require("../socket/socket");
const cloudinary = require("../lib/cloudinary");

const sendMessage = async (req, res) => {
  try {
    const { message, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    console.log("Message request received", { senderId, receiverId, message, image });

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Sender or receiver missing" });
    }

    if (!message && !image) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: message,
      image: image || "",
    });

    const savedMessage = await newMessage.save();

    if (savedMessage) {
      conversation.messages.push(savedMessage._id);
      await conversation.save();
    }

    const receiverSocketID = getReceiverSocketId(receiverId);
    const io = getIO();
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("newMessage", savedMessage);
    }
    const senderSocketID = getReceiverSocketId(senderId); // reuse same logic
    if (senderSocketID && senderSocketID !== receiverSocketID) {
      io.to(senderSocketID).emit("newMessage", savedMessage);
    }


    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("Error in sendMessage Controller:", err.message);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id: userToId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } },
      match: { _id: { $exists: true } }
    });

    if (!conversation) return res.status(200).json([]);

    // Filter out any null messages that might have slipped through
    const filteredMessages = conversation.messages
      ? conversation.messages.filter(msg => msg !== null)
      : [];

    res.status(200).json(filteredMessages);
  } catch (err) {
    console.log("Error in getMessage Controller:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessage };