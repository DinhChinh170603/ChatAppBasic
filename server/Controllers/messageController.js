const messageModel = require("../Models/messageModel");

// Create new message
const createMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;

    try {
        const newMessage = await messageModel({ chatId, senderId, message });
        const response = await newMessage.save();

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const findMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await messageModel.find({ chatId });

        res.status(200).json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = { createMessage, findMessages }