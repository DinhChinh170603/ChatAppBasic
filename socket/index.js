const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUsers = [];

// socket on: listen an event 
io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  // listen to a connection
  socket.on("new-user-add", (userId) => {
    // if user is not exist in onlineUsers then add to list and send to all client 
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id, // socket id of user
      });
    console.log("onlineUsers", onlineUsers);

    io.emit("get-online-users", onlineUsers);
  });

  // add message
  socket.on("send-message", (message) => {
    const receiver = onlineUsers.find(
      (user) => user.userId === message.recipientId
    ); // Find the socketId in the list that matches the recipient's socketid sent from the client

    // send to socketId needed
    if (receiver) {
      io.to(receiver.socketId).emit("get-message", message);
      io.to(receiver.socketId).emit("get-notification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("get-online-users", onlineUsers);

    console.log("disconnected", socket.id);
  });
});

io.listen(3000);  // must be different port to run double nodemon

