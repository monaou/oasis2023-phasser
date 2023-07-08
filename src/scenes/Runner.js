import Phaser from 'phaser'
import * as constants from "../constants.js"
import * as assets from "../classes/utility/Assets.js"
import { game, web3Connection } from "../index.js"
import WebFontFile from "../classes/utility/WebFontFile.js"
import * as utils from "../utils.js"

import EnvironmentManager from "../classes/game/EnvironmentManager.js"
import GroundManager from "../classes/game/GroundManager.js"
import ObstacleManager from "../classes/game/ObstacleManager.js"
import UserInterface from "../classes/game/UserInterface.js"
import PlayerCharacter from "../classes/game/PlayerCharacter.js"

// Main game scene
export default class Runner extends Phaser.Scene {
  constructor() {
    super('runner')
    this.environmentManager = null
    this.groundManager = null
    this.obstacleManager = null
    this.userInterface = null
    this.playerCharacter = null

    this.selectedCharSprite = 'pixelDinoGreen'
    this.selectedObstacleSprite = 'rockTall'
    this.selectedCloudSprite = 'cloud'
    this.selectedYamlSprite = 1

    this.score = 0
    this.difficultyLevel = 1

    this.cursors
    this.audioRefs = {}
    this.objectChannel = []

    this.isGameOver = false
  }

  // Process selected sprite data from main menu
  init(data) {
    if (data.characterSprite) {
      this.selectedCharSprite = data.characterSprite
    }
    if (data.obstacleSprite) {
      this.selectedObstacleSprite = data.obstacleSprite
    }
    if (data.cloudSprite) {
      this.selectedCloudSprite = data.cloudSprite
    }
    // this.selectedYamlSprite = 1
  }

  // Preload images, audio and other assets
  preload() {
    switch (this.selectedCharSprite) {
      case "pixelDinoGreen":
        this.load.spritesheet('dino', assets.img.pixelDinoGreenImage, { frameWidth: 100, frameHeight: 90 })
        break
      case "pixelDinoBlue":
        this.load.spritesheet('dino', assets.img.pixelDinoBlueImage, { frameWidth: 100, frameHeight: 90 })
        break
      case "pixelDinoRed":
        this.load.spritesheet('dino', assets.img.pixelDinoRedImage, { frameWidth: 100, frameHeight: 90 })
        break
    }

    this.load.image('ground', assets.img.groundImage)
    this.load.image('chain', assets.img.chainImage)
    this.load.image('block', assets.img.blockImage)

    this.load.image('rockTall', assets.img.rockTallImage)
    this.load.image('rockDuo', assets.img.rockDuoImage)
    this.load.image('rockWide', assets.img.rockWideImage)

    this.load.image('background', assets.img.backgroundImage)
    this.load.image('cloudLayer', assets.img.cloudLayerImage)
    this.load.image('backLayer', assets.img.backLayerImage)
    this.load.image('cloud', assets.img.cloudImage)

    this.load.image('buttonRestartUp', assets.ui.buttonRestartUpImage)
    this.load.image('buttonRestartDown', assets.ui.buttonRestartDownImage)
    this.load.image('buttonMenuUp', assets.ui.buttonMenuUpImage)
    this.load.image('buttonMenuDown', assets.ui.buttonMenuDownImage)

    // Load images for all registered nft art in local storage
    utils.getAllArtLinks(web3Connection.web3Address).forEach(a => {
      this.load.image(a.imageLink, a.imageLink)
    })

    this.load.audio('jump', assets.audio.jumpAudio)
    this.load.audio('lose', assets.audio.loseAudio)
    this.load.audio('win', assets.audio.winAudio)
    this.load.audio('select', assets.audio.selectAudio)
    this.load.audio('walk', assets.audio.walkAudio)

    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
  }

  // Runs once to initialize the game
  create() {
    // Set player and follow camera
    this.playerCharacter = new PlayerCharacter(this, this.audioRefs, this.selectedCharSprite)
    this.cameras.main.startFollow(this.playerCharacter.sprite)
    this.cameras.main.setLerp(1, 0) // Only follow horizontally
    this.cameras.main.originX = 0.5

    // Initialize an instance for each manager class
    // Each of these can be simply commented out to disable a module if it isn't needed
    this.environmentManager = new EnvironmentManager(this, this.playerCharacter.sprite, this.selectedCloudSprite)
    this.groundManager = new GroundManager(this, this.playerCharacter.sprite)
    this.obstacleManager = new ObstacleManager(this, this.playerCharacter.sprite, this.selectedYamlSprite)
    this.userInterface = new UserInterface(this, this.restartGame, this.returnToMenu, this.audioRefs)

    // Set up jump input for keyboard and screen tap
    this.cursors = this.input.keyboard.createCursorKeys()

    this.audioRefs.jumpSfx = this.sound.add('jump')
    this.audioRefs.loseSfx = this.sound.add('lose')
    this.audioRefs.selectSfx = this.sound.add('select')
    this.audioRefs.winSfx = this.sound.add('win')
    this.audioRefs.walkSfx = this.sound.add('walk')

    if (this.groundManager) {
      this.physics.add.collider(this.playerCharacter.sprite, this.groundManager.platforms)
    }

    if (this.obstacleManager) {
      this.obstacleManager.activeObstacles.forEach((obstacle_ch, index) => {
        this.objectChannel[index] = this.physics.add.overlap(this.playerCharacter.sprite, obstacle_ch, () => this.hitObstacle(index))
        if (this.groundManager) {
          this.physics.add.collider(obstacle_ch, this.groundManager.platforms)
        }
      })
    }

    if (web3Connection && this.userInterface) {
      this.userInterface.updateAddressText(web3Connection.web3Address)
    }
  }

  // Called on each frame to check for inputs, update score and call update on all managers
  update() {
    if (this.isGameOver) { return }
    this.updateScore()

    if (this.cursors.space.isDown) {
      this.playerCharacter.tryJump()
    }

    if (this.cursors.right.isDown) {
      this.playerCharacter.tryWalkRight()
    }

    if (this.cursors.left.isDown) {
      this.playerCharacter.tryWalkLeft()
    }

    if (this.cursors.right.isUp && this.cursors.left.isUp) {
      this.playerCharacter.tryStopWalk()
    }

    if (this.cursors.down.isDown) {
      this.playerCharacter.tryGuard()
    }

    if (this.cursors.down.isUp) {
      this.playerCharacter.tryGuardStop()
    }

    if (this.cursors.up.isDown) {
      this.playerCharacter.tryNormalAttack()
    }

    if (this.playerCharacter) {
      this.playerCharacter.update()
    }

    if (this.obstacleManager && this.playerCharacter && this.playerCharacter.chain) {
      this.obstacleManager.activeObstacles.forEach((obstacle_ch, index) => {
        // チェーンと岩が接触したら岩を壊す
        this.physics.add.overlap(this.playerCharacter.chain, obstacle_ch, () => this.obstacleManager.destroyObstacle(index));
      });
    }



    if (this.groundManager) {
      this.groundManager.update()
    }

    if (this.environmentManager) {
      this.environmentManager.update()
    }
  }

  updateScore = () => {
    this.score = Math.floor((this.playerCharacter.getTravelDistance() - constants.GAME.START_POS) * constants.GAME.SCORE_MULTIPLIER)

    if (this.userInterface) {
      this.userInterface.updateScoreText(this.score)
    }
  }

  hitObstacle = (index) => {
    console.log(index)
    this.isGameOver = true
    this.playerCharacter.die()
    this.audioRefs.loseSfx.play()

    if (this.objectChannel[index]) {
      this.objectChannel[index].destroy()
    }

    if (this.userInterface) {
      this.userInterface.restartButton.setVisible(true)
      this.userInterface.menuButton.setVisible(true)
    } else {
      // Automatically return to menu if interface doesn't exist
      this.time.delayedCall(1000, this.returnToMenu)
    }
  }

  // Destroy scene and create new one with same options
  restartGame = () => {
    game.scene.remove("runner")
    game.scene.add("runner", Runner, true, {
      characterSprite: this.selectedCharSprite,
      obstacleSprite: this.selectedObstacleSprite,
      cloudSprite: this.selectedCloudSprite,
    })
  }

  // Return to menu by reloading the page
  returnToMenu = () => {
    window.location.reload()
  }
}
