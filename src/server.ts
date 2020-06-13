const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ws = require('ws');
const https = require('https');
const webSocketsServerPort = 8000;
import {StartPhaseOneCommand} from '../frontend/src/types/Command';
import {Game} from '../frontend/src/types/Types';

const { v4: uuidv4 } = require('uuid')

const app = express();
const port = process.env.PORT || 5000;

const TWENTY_MINUTES_IN_MS = 1200000;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const prompts: string[] = ['Biscuits and gravy'];
const games: {[key: string]: Game} = {};
const clients = {};

// Websocket logic start
const wsServer = https.createServer(app);
const wss = new ws.Server({ server: wsServer });
wss.on('request', function (request) {
  const userID = uuidv4();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))
});
// Websocket logic end


const addNewLobby = () => {
  const id = uuidv4().slice(-6);
  const timerId = setTimeout(() => {
    delete games[id]
  }, TWENTY_MINUTES_IN_MS);

  games[id] = { timerId, players: [0] }
  return id;
}

const addPlayerToLobby = (id) => {
  if (games[id]) {
    const newPlayerId = games[id].players.length;
    games[id].players.push(newPlayerId);
    return { newPlayerId };
  }
  return { error: `lobby ${id} does not exist` }
}

const endLobby = (id) => delete games[id];


// ### Endpoints Start
app.post('/lobby/init', (req, res) => {
  let lobby = addNewLobby();
  res.status(200).send({ id: lobby });
});

app.post('/lobby/addPlayer', (req, res) => {
  const { body } = req;
  if (!body) {
    res.status(404).send({ error: 'Did not receive POST body' });
    return;
  }
  const { id } = body;
  if (!id) {
    res.status(404).send({ error: `Expected id, but received ${id}` });
    return;
  }
  const { newPlayerId, error } = addPlayerToLobby(id)
  if (error) {
    res.status(404).send({ error });
  }
  res.status(200).send({ playerId: newPlayerId, players: games[id].players });
});

app.delete('/lobby/end', (req, res) => {
  const { body } = req;
  if (!body) {
    res.status(404).send({ error: 'Did not receive DELETE body' });
    return;
  }
  const { id } = body;
  endLobby(id);
  res.status(200).send({ result: `Closed lobby with id: ${id}` })
})

app.get('/lobby/all', (req, res) => {
  res.send({ games: Object.keys(games) });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Endpoints End

app.listen(port, () => console.log(`Listening on port ${port}`));
app.listen(webSocketsServerPort)