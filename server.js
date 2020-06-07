const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const {v4: uuidv4} = require('uuid')
const util = require('util');

const app = express();
const port = process.env.PORT || 5000;

const TWENTY_MINUTES_IN_MS = 1200000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
lobby objects have interface: 
{
  timerId,
  players: [playerIds...]
}
*/
let lobbies = {}

const addNewLobby = () => {
  const id = uuidv4();
  const timerId = setTimeout(() => {
    delete lobbies[id]
  }, TWENTY_MINUTES_IN_MS);

  lobbies[id] = {timerId, players: [0]} 
  return id;
}

const addPlayerToLobby = (id) => {
  if (lobbies[id]) {
    const newPlayerId = lobbies[id].players.length;
    lobbies[id].players.push(newPlayerId);
    return {newPlayerId};
  }
  return {error: `lobby ${id} does not exist`}
}

const endLobby = (id) => delete lobbies[id];

app.get('/lobby/init', (req, res) => {
  let lobby = addNewLobby();
  res.status(200).send({id: lobby});
});

app.get('/lobby/addPlayer', (req, res) => {
  const { id } = req.query;
  const {newPlayerId, error} = addPlayerToLobby(id)
  if (error) {
    res.status(404).send({error});
  }
  res.status(200).send({playerId: newPlayerId, players: lobbies[id].players});
});

app.get('/lobby/end', (req, res) => {
  const { id } = req.query;
  endLobby(id);
  res.status(200).send({result: `Closed lobby with id: ${id}`})
})

app.get('/lobby/all', (req, res) => {
  res.send({lobbies: Object.keys(lobbies)});
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'frontend/build')));
    
  // Handle React routing, return all requests to React app
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
