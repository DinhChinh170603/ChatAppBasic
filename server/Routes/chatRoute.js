const express = require("express");
const { createChat, findUsersChat, findChat } = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUsersChat);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
