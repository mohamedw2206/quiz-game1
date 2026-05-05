require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let rooms = {};

function question() {
  return {
    text: "عاصمة مصر؟",
    answers: [
      { text: "القاهرة", correct: true },
      { text: "الجيزة", correct: false },
      { text: "أسوان", correct: false },
      { text: "الأقصر", correct: false }
    ]
  };
}

io.on("connection", socket => {
  socket.on("createRoom", name => {
    const code = Math.random().toString(36).substr(2,5).toUpperCase();
    rooms[code] = { players: [] };

    rooms[code].players.push({ id: socket.id, name, score: 0 });

    socket.join(code);
    socket.emit("room", code);
    io.to(code).emit("players", rooms[code].players);
  });

  socket.on("joinRoom", ({ code, name }) => {
    if (!rooms[code]) return;

    rooms[code].players.push({ id: socket.id, name, score: 0 });
    socket.join(code);

    io.to(code).emit("players", rooms[code].players);
  });

  socket.on("getQ", code => {
    io.to(code).emit("q", question());
  });

  socket.on("ans", ({ code, correct }) => {
    const p = rooms[code].players.find(p=>p.id===socket.id);
    if(correct) p.score+=10;

    io.to(code).emit("players", rooms[code].players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
