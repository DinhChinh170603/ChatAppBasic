const chatModel = require("../Models/chatModel");

// Create new chat
const createChat = async (req, res) => {
    // Create variables to store and process requests from the client side
    const { firstId, secondId } = req.body; // method body "/api"

    try {
        // Check if chat with firstId and secondId already exists
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }, // Find more than one ele must be using $all. Condition
        });

        if (chat) {
            return res.status(200).json(chat);
        };

        // Else create new chat
        const newChat = await chatModel({ members: [firstId, secondId] });

        const response = await newChat.save(); // Save to dtb
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// findUsersChat
const findUsersChat = async (req, res) => {
    const userId = req.params.userId; // method params "/api/:userId"

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }, // Find just one ele must be using $in
        });
        res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}


// findChat
const findChat = async (req, res) => {
    const { firstId, secondId } = req.params;

    try {
        const chat = await chatModel.find({
            members: { $all: [firstId, secondId] },
        });
        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = { createChat, findUsersChat, findChat }