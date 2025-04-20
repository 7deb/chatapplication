const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {  // Change from 'message' to 'text'
        type: String, 
    },
    image: {
        type: String,
    }
}, { timestamps: true });

const Message = new mongoose.model("Message",messageSchema);

module.exports = Message;