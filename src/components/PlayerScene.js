import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import Menu from "../scenes/Menu.js";
import Runner from "../scenes/Runner.js";
import Modal from "../hooks/gameModal.js";
import * as constants from "../constants.js";

const PlayerScene = ({ address, tokenId }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen && document.getElementById('phaser-game')) {
      initializeGame();
    }
  }, [isModalOpen]);

  const initializeGame = () => {
    var config = {
      type: Phaser.AUTO,
      width: constants.GAME.CANVAS_WIDTH,
      height: constants.GAME.CANVAS_HEIGHT,
      parent: 'phaser-game',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: constants.GAME.GRAVITY_Y },
        }
      },
      scene: [Menu, Runner],
      autoCenter: Phaser.Scale.CENTER_BOTH,
    };

    const game = new Phaser.Game(config);
    game.scene.start('menu', { address: address, tokenId: tokenId });
  };

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Start Here</button>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <div id="phaser-game"></div>
        </Modal>
      )}
    </div>
  );
};

export default PlayerScene;
