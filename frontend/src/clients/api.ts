export const createLobby = () => fetch('http://localhost:5000/lobby/init/', {
  method: 'POST',
})
  .then(data => data.json());

export class WsConnection {
  ws: WebSocket;
  gameId: string;

  constructor(gameId: string) {
    this.ws = new WebSocket('wss://localhost:40510', 'json');
    this.gameId = gameId;
    this.ws.onopen = () => {
      console.log('connected')
      this.ws.send(gameId)
    }
  }

}
/*
  var ws = new WebSocket('wss://localhost:40510', 'json');
// event emmited when connected
ws.onopen = function () {
  console.log('websocket is connected ...')
  // sending a send event to websocket server
}
// event emmited when receiving message 
ws.onmessage = function (ev) {
  console.log(ev.data);
  // ws.send(JSON.stringify({`got message ${ev.data}`}));
}
*/