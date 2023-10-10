const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  try {
    console.log(userId);
    console.log(socketId);
    !users.some((user) => user.userId === userId) &&
      users.push({
        userId,
        socketId,
      });
  } catch (error) {
    console.log(`${error}`);
  }
};
const removeUser = (socketId) => {
  try {
    users = users.filter((user) => {
      user.socketId !== socketId;
    });
  } catch (error) {
    console.log(`${error}`);
  }
};

const getUser = (userId) => {
  try {
    return users.find((user) => user.userId === userId);
  } catch (error) {
    console.log(`${error}`);
  }
};

io.on("connection", (socket) => {
  console.log("A user connected to socket server");

  socket.on("addUser", (userId) => {
    try {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    } catch (error) {
      console.log(`${error}`);
    }
  });

  socket.on("disconnect", () => {
    try {
      console.log("A user has disconnected");
      removeUser(socket.id);
      io.emit("getUsers", users);
    } catch (error) {}
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    try {
      const user = getUser(receiverId);
      console.log("User:", user);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    } catch (error) {
      console.log(`${error}`);
    }
  });
});
