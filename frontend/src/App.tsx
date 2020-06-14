import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import HomePage from "./components/HomePage"
import GameNotFoundPage from "./components/GameNotFoundPage"
import GamePage from "./components/GamePage"
import './App.scss';
import './'

const App = () => {

  return (
    <div className="App">
      <span>
        <Router>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/game-not-found" component={GameNotFoundPage}/>
          <Route exact path="/game/:gameID" component={GamePage}/> 
        </Router>
      </span>
    </div>
  );
};

export default App;
