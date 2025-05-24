const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

let votes = JSON.parse(fs.readFileSync('votes.json'));
let votedUsers = [];

app.post('/vote', (req, res) => {
  const { voterId, candidateId } = req.body;

  if (votedUsers.includes(voterId)) {
    return res.status(403).json({ message: "You already voted!" });
  }

  votes[candidateId]++;
  votedUsers.push(voterId);

  fs.writeFileSync('votes.json', JSON.stringify(votes));
  io.emit('voteUpdate', votes);

  res.json({ message: "Vote recorded." });
});

app.get('/votes', (req, res) => {
  res.json(votes);
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
