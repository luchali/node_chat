import express from 'express';
import cors from 'cors';
import EventEmitter from 'node:events';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

type Message = {
  text: string;
  time: Date;
  author: string;
};

type User = {
  name: string;
}

const users: User[] = [];

app.post('/users', (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).json({ error: 'Name is required' });

    return;
  }

  const user = { name };

  users.push(user);

  res.status(201).json(user);
});

const messages = [] as Message[];
const messageEmitter = new EventEmitter();

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');

  const callback = (data: Message) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  messageEmitter.on('message', callback);
  req.on('close', () => messageEmitter.off('message', callback));
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const message = {
    text: req.body.text,
    time: new Date(),
    author: req.body.author,
  };

  messages.push(message);
  messageEmitter.emit('message', message);
  res.status(201).json(message);
});

const server = app.listen(PORT);
const wss = new WebSocketServer({ server });

wss.on('connection', (client) => {
  // Event handler for new client connections
  console.log('A new client connected');

  // Event handler for receiving data from clients
  client.on('message', (data) => {
    console.log(`Received data: ${data}`);

    // Sending a response to the client
    client.send('Data received');
  });
});

messageEmitter.on('message', (data) => {
  for (const client of wss.clients) {
    client.send(JSON.stringify(data));
  }
});
