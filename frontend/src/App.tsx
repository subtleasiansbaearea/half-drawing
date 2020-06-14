import './App.scss';
import './'

import { Link, Route, BrowserRouter as Router } from 'react-router-dom';

import GameNotFoundPage from "./components/GameNotFoundPage"
import GamePage from "./components/GamePage"
import HomePage from "./components/HomePage"
import React, { useEffect } from 'react';

import { w3cwebsocket as W3CWebSocket } from "websocket";
var ws = new WebSocket('ws://localhost:40510');
// event emmited when connected
ws.onopen = function () {
  console.log('websocket is connected ...')
  // sending a send event to websocket server
  ws.send('connected')
}
// event emmited when receiving message 
ws.onmessage = function (ev) {
  console.log(ev.data);
  ws.send(`got message ${ev.data}`);
}
const App = () => {
  // Set a full width CSS temporarily just for debugging purposes
  const FULL_WIDTH_CSS = { width: '100%' };

  return (
    <div className="App">
      <h1>Biscuits and Gravy</h1>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/game" component={GameNotFoundPage} />
        <Route exact path="/game/:gameId" component={GamePage} />

        <span style={FULL_WIDTH_CSS}>
          <Link to="/">Home</Link><br />
          <Link to="/game">Game404</Link><br />
          <Link to="/game/gameId">Game</Link>
        </span>
      </Router>
    </div>
  );
};

export default App;
