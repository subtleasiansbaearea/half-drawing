import { ClientMessage } from "../frontend/src/types/Transport";

const gameService = require('./gameService');
const { games } = gameService;

// # Websocket logic start
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510})

wss.on('connection', function (ws) {
  console.log('ws:')
  console.log(ws)
  ws.on('message', function (message: string) {
    console.log('received: %s', message)
    const parsedMessage: ClientMessage = JSON.parse(message);
    const {gameState, gameId} = message;
    
    
  })

  // setInterval(
  //   () => ws.send(JSON.stringify({action: 'PHASE_ONE', data: []})),
  //   1000
  // )
})

export function foo() {
  console.log('hi')
}
