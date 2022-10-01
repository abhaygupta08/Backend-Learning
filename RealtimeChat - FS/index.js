const express = require("express");
const app = express();
const http = require("http")
const cors = require("cors");
const path = require("path");
const fs = require("fs");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.use('/get-random-name', require('./utils/randomName'))

app.get('/chat', (req, res) => {
  const readFile = fs.readFileSync(path.join(__dirname, 'public', 'chat.json'), 'utf8');
  res.json(JSON.parse(readFile));
})

app.post('/chat', (req, res) => {
  const { name, message } = req.body;
  const readFile = fs.readFileSync(path.join(__dirname, 'public', 'chat.json'), 'utf8');
  const data = JSON.parse(readFile);
  data.data.push({ name, message });
  fs.writeFileSync(path.join(__dirname, 'public', 'chat.json'), JSON.stringify(data));
  res.json({ name, message });
})

app.delete('/chat', (req, res) => {
  fs.writeFileSync(path.join(__dirname, 'public', 'chat.json'), JSON.stringify({ data: [] }));
  res.json({ message: 'success' });
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

server.listen(3000, () => {
  console.log("Server is running on port 3000");
}

);


