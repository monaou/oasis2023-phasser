import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import PhaserIndex from './phaser_index.js';
import EditPage from './edit.js';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Welcome to dino marker</h1>
        <Link to="/game">
          <button>Go to dino Game</button>
        </Link>
        <Link to="/edit">
          <button>Go to Edit Mode</button>
        </Link>

        <Switch>
          <Route path="/game">
            <PhaserIndex />
          </Route>
          <Route path="/edit">
            <EditPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
