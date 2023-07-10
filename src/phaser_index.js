// src/phaser-index.js

import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import Menu from "./scenes/Menu.js";
import Runner from "./scenes/Runner.js";
import Web3Connection from "./classes/utility/Web3Connection.js";
import * as constants from "./constants.js";

const PhaserIndex = () => {
  useEffect(() => {
    var config = {
      type: Phaser.AUTO,
      width: constants.GAME.CANVAS_WIDTH,
      height: constants.GAME.CANVAS_HEIGHT,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: constants.GAME.GRAVITY_Y },
          // Turn debug on to see collision boxes
          // debug: true,
        }
      },
      // Initializes both the menu and runner scene
      scene: [Menu, Runner],

      // Center canvas element on website
      autoCenter: Phaser.Scale.CENTER_BOTH,
    }

    // Creates new instance of phaser game
    const game = new Phaser.Game(config);

    // // Initialize web3 connection

    // // Start game
    // game.scene.start('Menu', { web3Connection: newWeb3Connection });
  }, []);

  return (
      <div id="phaser-game"></div>
  );
};

export default PhaserIndex;
