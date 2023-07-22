// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './App';
import PhaserGame from './phaser_index';
import Edit from './edit';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Phaserゲームの開始
// PhaserGame();
