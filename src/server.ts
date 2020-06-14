import GameService from './GameService';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 5000;

const TWENTY_MINUTES_IN_MS = 1200000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


export const games: { [LobbyId: string]: GameService } = {};

const createNewGame = () => {
  const id = uuidv4().slice(-6);
  const timerId = setTimeout(() => {
    delete games[id]
  }, TWENTY_MINUTES_IN_MS);

  games[id] = new GameService(timerId)
  return id;
}

const addPlayerToLobby = (id: string) => {
  if (games[id]) {
    const newPlayerId = games[id].players.length;
    // games[id].players.push(newPlayerId); // FIXME
    return { newPlayerId };
  }
  return { error: `lobby ${id} does not exist` }
}

const endLobby = (id: string) => delete games[id];


// ### Endpoints Start
app.post('/lobby/init', (req: any, res: any) => {
  let lobby = createNewGame();
  res.status(200).json({ id: lobby });
});

app.post('/lobby/addPlayer', (req: any, res: any) => {
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

app.delete('/lobby/end', (req: any, res: any) => {
  const { body } = req;
  if (!body) {
    res.status(404).send({ error: 'Did not receive DELETE body' });
    return;
  }
  const { id } = body;
  endLobby(id);
  res.status(200).send({ result: `Closed lobby with id: ${id}` })
})

app.get('/lobby/all', (req: any, res: any) => {
  res.send({ games: Object.keys(games) });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Endpoints End

app.listen(port, () => console.log(`Listening on port ${port}`));