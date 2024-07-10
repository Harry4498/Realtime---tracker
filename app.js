const express = require("express");
const app = express();
const port = 3000;
const http = require("http");
const path = require("path");
const { disconnect } = require("process");
//socket io

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

//Ejs Engine

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  // accept the location from the frontend ( script.js )
  socket.on("sendLocation", (data) => {
    // sending to all frontend user
    io.emit("receive-location", { id: socket.id, ...data });
  });
  console.log("connection established");


  socket.on ( disconnect, () => {
    // sending to all frontend user that user is diconnected
    io.emit("user-disconnected", socket.id);
  })
});

app.get("/", (req, res) => {
  res.render("index");
});
server.listen(port, () => {
  console.log(" App is running on port" + port);
});
