const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.broadcast.emit("update", username + " " + "เข้าร่วมการสนทนา");
  });
  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " " + "ออกจากการสนทนา");
  });
  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});

const port = 5000 || process.env.PORT;
server.listen(port, () => {
  console.log(`Server is Running at http://localhost${port}...`);
});
