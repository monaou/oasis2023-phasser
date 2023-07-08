import Phaser from 'phaser'
import * as constants from "../constants.js"
import * as assets from "../classes/utility/Assets.js"
import { game, web3Connection } from "../index.js"
import WebFontFile from "../classes/utility/WebFontFile.js"
import * as utils from "../utils.js"

import EnvironmentManager from "../classes/game/EnvironmentManager.js"
import GroundManager from "../classes/game/GroundManager.js"
import ObstacleManager from "../classes/game/ObstacleManager.js"
import StoneManager from "../classes/game/StoneManager.js"
import GoalManager from "../classes/game/GoalManager.js"
import CoinManager from "../classes/game/CoinManager.js"
import EnemyManager from "../classes/game/EnemyManager.js"
import UserInterface from "../classes/game/UserInterface.js"
import PlayerCharacter from "../classes/game/PlayerCharacter.js"


// Main game scene
export default class Runner extends Phaser.Scene {
  constructor() {
    super('runner')
    this.environmentManager = null
    this.groundManager = null
    this.obstacleManager = null
    this.stoneManager = null
    this.goalManager = null
    this.coinManager = null
    this.enemyManager = null
    this.userInterface = null
    this.playerCharacter = null

    this.selectedCharSprite = 'pixelDinoGreen'
    this.selectedObstacleSprite = 'rockTall'
    this.selectedCloudSprite = 'cloud'
    this.selectedYamlSprite = 1

    this.score = 0
    this.coin = 0
    this.difficultyLevel = 1

    this.cursors
    this.audioRefs = {}
    this.objectChannel = []
    this.coinChannel = []
    this.enemyChannel = []

    this.isGameOver = false
    this.isGoal = false
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
    this.stoneManager = new StoneManager(this, this.playerCharacter.sprite, this.selectedYamlSprite)
    this.goalManager = new GoalManager(this, this.playerCharacter.sprite, this.selectedYamlSprite)
    this.coinManager = new CoinManager(this, this.playerCharacter.sprite, this.selectedYamlSprite)
    this.enemyManager = new EnemyManager(this, this.playerCharacter.sprite, this.selectedYamlSprite)
    this.userInterface = new UserInterface(this, this.restartGame, this.returnToMenu, this.reachGoal, this.audioRefs)

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
        this.objectChannel[index] = this.physics.add.overlap(this.playerCharacter.sprite, obstacle_ch, this.hitObstacle)
        if (this.groundManager) {
          this.physics.add.collider(obstacle_ch, this.groundManager.platforms)
        }
      })
    }

    if (this.stoneManager) {
      this.stoneManager.activeStones.forEach((stone_ch) => {
        if (this.playerCharacter) {
          this.physics.add.collider(this.playerCharacter.sprite, stone_ch)
        }
      })
    }

    if (this.goalManager) {
      this.goalManager.activeGoals.forEach((goal_ch, index) => {
        this.physics.add.overlap(this.playerCharacter.sprite, goal_ch, () => this.hitGoal(index))
      })
    }

    if (this.coinManager) {
      console.log("init")
      this.coinManager.activeCoins.forEach((coin_ch, index) => {
        this.coinChannel[index] = this.physics.add.overlap(this.playerCharacter.sprite, coin_ch, () => this.hitCoin(index))
      })
    }

    if (this.enemyManager) {
      this.enemyManager.activeEnemies.forEach((enemy_ch, index) => {
        this.enemyChannel[index] = this.physics.add.overlap(this.playerCharacter.sprite, enemy_ch, this.hitObstacle)
        if (this.groundManager) {
          this.physics.add.collider(enemy_ch, this.groundManager.platforms)
        }
      })
    }

    if (web3Connection && this.userInterface) {
      this.userInterface.updateAddressText(web3Connection.web3Address)
    }
  }

  // Called on each frame to check for inputs, update score and call update on all managers
  update() {
    if (this.isGameOver || this.isGoal) { return }
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

    if (this.playerCharacter && this.playerCharacter.chain) {
      if(this.obstacleManager){
        this.obstacleManager.activeObstacles.forEach((obstacle_ch, index) => {
          this.physics.add.overlap(this.playerCharacter.chain, obstacle_ch, () => this.obstacleManager.destroyObstacle(index));
        });
      }
      if(this.enemyManager){
        this.enemyManager.activeEnemies.forEach((enemy_ch, index) => {
          this.physics.add.overlap(this.playerCharacter.chain, enemy_ch, () => this.enemyManager.destroyEnemy(index));
        });
      }
    }
    

    if (this.enemyManager && this.playerCharacter && this.playerCharacter.block) {
      this.enemyManager.activeEnemies.forEach((enemy_ch, index) => {
        this.enemyChannel[index] = this.physics.add.collider(this.playerCharacter.block, enemy_ch);
      });
    }

    if (this.groundManager) {
      this.groundManager.update()
    }

    if (this.environmentManager) {
      this.environmentManager.update()
    }

    if (this.enemyManager) {
      this.enemyManager.update()
    }
  }

  updateScore = () => {
    this.score = Math.floor((this.playerCharacter.getTravelDistance() - constants.GAME.START_POS) * constants.GAME.SCORE_MULTIPLIER)

    if (this.userInterface) {
      this.userInterface.updateScoreText(this.score)
    }
  }

  hitObstacle = () => {
    this.isGameOver = true
    this.playerCharacter.die()
    this.audioRefs.loseSfx.play()

    if (this.userInterface) {
      this.userInterface.restartButton.setVisible(true)
      this.userInterface.menuButton.setVisible(true)
    } else {
      // Automatically return to menu if interface doesn't exist
      this.time.delayedCall(1000, this.returnToMenu)
    }
  }

  hitGoal = (index) => {
    this.isGoal = true
    this.playerCharacter.win()
    // this.audioRefs.loseSfx.play()

    if (this.userInterface) {
      this.userInterface.resultButton.setVisible(true)
      this.userInterface.menuButton.setVisible(true)
    } else {
      // Automatically return to menu if interface doesn't exist
      this.time.delayedCall(1000, this.returnToMenu)
    }
  }

  hitCoin = (index) => {
    console.log("hitCoin")
    this.coin++
    if (this.userInterface) {
      this.userInterface.updateCoinText(this.coin)
    }
    if (this.coinChannel[index]) {
      this.coinChannel[index].destroy()
      this.coinManager.destroyCoin(index)
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

  // Destroy scene and create new one with same options
  reachGoal = () => {
    game.scene.remove("runner")
  }

  // Return to menu by reloading the page
  returnToMenu = () => {
    window.location.reload()
  }
}
