const mongoose = require("mongoose");

// Create schema to define data structures, members is an array coming with two element is sendID and receiveID
const chatSchema = new mongoose.Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;
