const express = require("express");
const messagerouter = express.Router();
const authToken = require("../middleware/middleware");
const getusersforSideBar = require("../controller/userController");
const { getMessage, sendMessage } = require("../controller/messageController");

messagerouter.get("/users",authToken,getusersforSideBar);
messagerouter.get("/:id",authToken,getMessage);
messagerouter.post("/send/:id",authToken,sendMessage);

module.exports = messagerouter;

