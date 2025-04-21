const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { io, getReceiverSocketId } = require("../socket/socket");
const cloudinary = require("../lib/cloudinary");

const sendMessage = async (req, res) => {
  try {
    const { message, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    
    // Check if at least one of message or image is provided
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

    // Create new message with text field (renamed from message)
    const newMessage = new Message({
      senderId,
      receiverId,
      text: message, // Use text field instead of message
      image: image || "",
    });

    // Save the message
    const savedMessage = await newMessage.save();
    
    // If message saved successfully, update the conversation
    if (savedMessage) {
      conversation.messages.push(savedMessage._id);
    }

    // Save the updated conversation
    await conversation.save();

    // Send response
    res.status(201).json(savedMessage);
  } catch (err) {
    console.log("Error in sendMessage Controller:", err.message);
    res.status(500).json({ message: "Internal server error" });
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