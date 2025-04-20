const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { io, getReceiverSocketId } = require("../socket/socket");
const cloudinary = require("../lib/cloudinary");

const sendMessage = async (req, res) => {
  try {
    const { message, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!message && !image) {
      return res.status(400).json({ message: "Message text or image is required." });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    let imageUrl;
    if (image) {
      try {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const dataUri = `data:image/jpeg;base64,${base64Data}`;
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
          folder: "chat_images",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ message: "Image upload failed." });
      }
    }

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      image: imageUrl || null,
    });

    await newMessage.save();
    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Safely handle the message object
      const messageForSocket = newMessage.toObject 
        ? newMessage.toObject() 
        : { ...newMessage._doc };
      io.to(receiverSocketId).emit("newMessage", {
        ...messageForSocket,
        text: newMessage.message
      });
    }

    res.status(201).json({
      ...(newMessage.toObject ? newMessage.toObject() : newMessage._doc),
      text: newMessage.message
    });
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
      // Add match to filter out null references
      match: { _id: { $exists: true } },
      transform: (doc) => {
        if (!doc) return null; // Skip null documents
        
        // Safely handle the document
        const docObject = doc.toObject ? doc.toObject() : doc;
        return {
          ...docObject,
          text: doc.message,
          senderId: doc.senderId,
          createdAt: doc.createdAt,
          image: doc.image || null
        };
      }
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