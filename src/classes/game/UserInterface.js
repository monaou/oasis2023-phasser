import * as constants from "../../constants.js"
import CustomFixedButton from "../interfaceElements/CustomFixedButton.js"
import Phaser from 'phaser'

// Class for interface shown during runner game
export default class UserInterface {
  constructor(runnerScene, restartGame, returnToMenu, reachGoal, audioRefs) {
    this.runnerScene = runnerScene
    this.restartGame = restartGame
    this.returnToMenu = returnToMenu
    this.reachGoal = reachGoal
    this.audioRefs = audioRefs
    this.textFont = '"Press Start 2P"'
    this.scoreText
    this.resultText
    this.restartButton
    this.resultButton
    this.menuButton

    this.initUI()
  }

  initUI = () => {
    this.scoreText = this.runnerScene.add.text(25, 65, 'Score: 0', { fontSize: '32px', fill: '#FFF', fontFamily: this.textFont })
    this.coinText = this.runnerScene.add.text(25, 105, 'SatoshiCoin: 0', { fontSize: '32px', fill: '#FFF', fontFamily: this.textFont })
    this.resultText = this.runnerScene.add.text(500, 200, '', { fontSize: '32px', fill: '#FFF', fontFamily: this.textFont })
    this.coinText.setScrollFactor(0)
    this.coinText.setDepth(constants.INTERFACE.HUD_RENDER_DEPTH)
    this.scoreText.setScrollFactor(0)
    this.scoreText.setDepth(constants.INTERFACE.HUD_RENDER_DEPTH)
    this.resultText.setScrollFactor(0)
    this.resultText.setDepth(constants.INTERFACE.HUD_RENDER_DEPTH)

    this.createMenuButtons()
  }

  restartClick = () => {
    this.audioRefs.selectSfx.play()
  }

  menuClick = () => {
    this.audioRefs.selectSfx.play()
  }

  createMenuButtons = () => {
    this.createResultButton()
    // this.createRestartButton()
    this.createBackToMenuButton()
  }

  // createRestartButton = () => {
  //   this.restartButton = new CustomFixedButton(
  //     this.runnerScene, constants.GAME.CANVAS_WIDTH / 2,
  //     constants.GAME.CANVAS_HEIGHT / 2 - 50,
  //     'buttonRestartUp', 'buttonRestartDown',
  //     1
  //   )
  //   this.runnerScene.add.existing(this.restartButton)
  //   this.restartButton.setVisible(false)

  //   // Set button interactive for desktop and mobile
  //   this.restartButton.overImage.setInteractive()
  //     .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.restartClick)
  //   this.restartButton.upImage.setInteractive()
  //     .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.restartClick)
  // }

  createResultButton = () => {
    this.resultButton = new CustomFixedButton(
      this.runnerScene, constants.GAME.CANVAS_WIDTH / 2,
      constants.GAME.CANVAS_HEIGHT / 2 + 100,
      'buttonRestartUp', 'buttonRestartDown',
      1
    )
    this.runnerScene.add.existing(this.resultButton)
    this.resultButton.setVisible(false)

    // Set button interactive for desktop and mobile
    this.resultButton.overImage.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.restartGame)
    this.resultButton.upImage.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.restartGame)
  }

  createBackToMenuButton = () => {
    this.menuButton = new CustomFixedButton(
      this.runnerScene, constants.GAME.CANVAS_WIDTH / 2,
      constants.GAME.CANVAS_HEIGHT / 2 + 50,
      'buttonMenuUp', 'buttonMenuDown',
      1
    )
    this.runnerScene.add.existing(this.menuButton)
    this.menuButton.setVisible(false)

    // Set button interactive for desktop and mobile
    this.menuButton.overImage.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.returnToMenu)
    this.menuButton.upImage.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.returnToMenu)
  }

  updateScoreText = (score) => {
    this.scoreText.setText('Score: ' + score)
  }

  updateCoinText = (coin) => {
    this.coinText.setText('SatoshiCoin: ' + coin)
  }

  updateResultText = () => {
    this.resultText.setText('Goal!!!')
  }
}