import { ClientMessage } from '../frontend/src/types/Transport';
import WebSocket from 'ws';
import { games } from './server';

export const prompts: string[] = ['Biscuits and gravy', 'Mac and Cheese'];


// # Websocket logic start

const wss = new WebSocket.Server({ port: 40510 })

wss.on('connection', function (ws: WebSocket) {

  ws.on('message', function (message: string) {
    console.log('received: %s', message)
    const parsedMessage: ClientMessage = JSON.parse(message);
    const { gameId } = parsedMessage;
    const game = games[gameId];

    game.handleClientMessage(ws, parsedMessage);
  })

  // Garbage code
  setInterval(
    () => ws.send(JSON.stringify({ action: 'PHASE_ONE', data: [] })),
    1000
  )
})
