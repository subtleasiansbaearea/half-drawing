import { ClientMessage, ClientResponse, LobbyRequest, MESSAGE_TYPE } from '../frontend/src/types/Transport';

import GameService from './GameService';
import WebSocket from 'ws';
import { games } from './server';

export const prompts: string[] = ['Biscuits and gravy', 'Mac and Cheese'];


// # Websocket logic start

const wss = new WebSocket.Server({ port: 40510 })

wss.on('connection', function (ws: WebSocket) {

  ws.on('message', function (message: string) {
    console.log('received: %s', message)
    const parsedMessage: ClientMessage = JSON.parse(message);
    const { type, gameId } = parsedMessage;
    const game = games[gameId];

    switch (type) {
      case MESSAGE_TYPE.LOBBY:
        game.handleLobbyMessage(parsedMessage as LobbyRequest);
        break;
      case MESSAGE_TYPE.GAME:
        game.handleGameMessage(parsedMessage as ClientResponse);
        break;
    }
  })

  // Garbage code
  setInterval(
    () => ws.send(JSON.stringify({ action: 'PHASE_ONE', data: [] })),
    1000
  )
})
