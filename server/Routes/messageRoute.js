const express = require("express");
const { createMessage, findMessages } = require("../Controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", findMessages);

module.exports = router;