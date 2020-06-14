// # Websocket logic start

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510})

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message)
  })

  setInterval(
    () => ws.send(`${new Date()}`),
    1000
  )
})


// var server = https.createServer(function(request, response) {
//   // process HTTP request. Since we're writing just WebSockets
//   // server we don't have to implement anything.
// });
// server.listen(1337, function() { });

// // create the server
// wsServer = new WebSocketServer({
//   httpServer: server
// });

// // WebSocket server
// wsServer.on('request', function(request) {
//   var connection = request.accept(null, request.origin);

//   // This is the most important callback for us, we'll handle
//   // all messages from users here.
//   connection.on('message', function(message) {
//     if (message.type === 'utf8') {
//       // process WebSocket message
//     }
//   });

//   connection.on('close', function(connection) {
//     // close user connection
//   });
// });



// const wsServer = new ws.Server({ port: 8080 })
// const wss = new ws.Server({ server: wsServer });
// wss.on('request', function (request: any ) { // TODO: fix type
//   const userID = uuidv4();
//   console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
//   // You can rewrite this part of the code to accept only the requests from allowed origin
//   const connection = request.accept(null, request.origin);
//   // clients[userID] = connection;
//   console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))
// });
// # Websocket logic end