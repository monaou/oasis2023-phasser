import Phaser from 'phaser'
import * as constants from "../constants.js"
import * as assets from "../classes/utility/Assets.js"
import { ethers } from "ethers"
import rewardPool from '../shared_json/RewardPool.json';

import EnvironmentManager from "../classes/game/EnvironmentManager.js"
import GroundManager from "../classes/game/GroundManager.js"
import ObstacleManager from "../classes/game/ObstacleManager.js"
import StoneManager from "../classes/game/StoneManager.js"
import GoalManager from "../classes/game/GoalManager.js"
import CoinManager from "../classes/game/CoinManager.js"
import EnemyManager from "../classes/game/EnemyManager.js"
import EnemyBossManager from "../classes/game/EnemyBossManager.js"
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
    this.stageData
    this.tokenId

    this.score = 0
    this.coin = 0
    this.difficultyLevel = 1

    this.cursors
    this.audioRefs = {}
    this.objectChannel = []
    this.coinChannel = []
    this.enemyChannel = []
    this.enemyBossChannel = []
    this.enemyBossChannelProj = []

    this.isGameOver = false
    this.isGoal = false
  }

  // Process selected sprite data from main menu
  init(data) {
    // TODO : conncet db
    if (data.stage_data) {
      this.stageData = data.stage_data
    }
    if (data.tokenId) {
      this.tokenId = data.tokenId
    }
  }

  // Preload images, audio and other assets
  preload() {
    this.load.spritesheet('dino', assets.img.pixelDinoGreenImage, { frameWidth: 100, frameHeight: 90 })

    this.load.image('ground', assets.img.groundImage)
    this.load.image('chain', assets.img.chainImage)
    this.load.image('block', assets.img.blockImage)

    this.load.image('character', assets.img.characterImage)
    this.load.image('coin', assets.img.coinImage)
    this.load.image('enemy_boss', assets.img.enemyBossImage)
    this.load.image('enemy', assets.img.enemyImage)
    this.load.image('fire', assets.img.fireImage)
    this.load.image('goal', assets.img.goalImage)
    this.load.image('stone', assets.img.stoneImage)
    this.load.image('obstacle', assets.img.obstacleImage)


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

    this.load.audio('jump', assets.audio.jumpAudio)
    this.load.audio('lose', assets.audio.loseAudio)
    this.load.audio('win', assets.audio.winAudio)
    this.load.audio('select', assets.audio.selectAudio)
    this.load.audio('walk', assets.audio.walkAudio)
  }

  // Runs once to initialize the game
  create() {
    // Set player and follow camera
    this.playerCharacter = new PlayerCharacter(this, this.audioRefs)
    this.cameras.main.startFollow(this.playerCharacter.sprite)
    this.cameras.main.setLerp(1, 0) // Only follow horizontally
    this.cameras.main.originX = 0.5

    // Initialize an instance for each manager class
    // Each of these can be simply commented out to disable a module if it isn't needed
    this.environmentManager = new EnvironmentManager(this, this.playerCharacter.sprite)
    this.groundManager = new GroundManager(this, this.playerCharacter.sprite)
    this.obstacleManager = new ObstacleManager(this, this.playerCharacter.sprite, this.stageData)
    this.stoneManager = new StoneManager(this, this.playerCharacter.sprite, this.stageData)
    this.goalManager = new GoalManager(this, this.playerCharacter.sprite, this.stageData)
    this.coinManager = new CoinManager(this, this.playerCharacter.sprite, this.stageData)
    this.enemyManager = new EnemyManager(this, this.playerCharacter.sprite, this.stageData)
    this.enemyBossManager = new EnemyBossManager(this, this.playerCharacter.sprite, this.stageData)
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

    if (this.enemyBossManager) {
      this.enemyBossManager.activeEnemies.forEach((enemy_ch, index) => {
        this.enemyBossChannel[index] = this.physics.add.overlap(this.playerCharacter.sprite, enemy_ch, this.hitObstacle)
        if (this.groundManager) {
          this.physics.add.collider(enemy_ch, this.groundManager.platforms)
        }
      })
    }

    if (this.userInterface) {
    }
  }

  // Called on each frame to check for inputs, update score and call update on all managers
  update() {
    if (this.isGoal) {
      this.userInterface.updateResultText()
    }
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
      if (this.obstacleManager) {
        this.obstacleManager.activeObstacles.forEach((obstacle_ch, index) => {
          this.physics.add.overlap(this.playerCharacter.chain, obstacle_ch, () => this.obstacleManager.destroyObstacle(index));
        });
      }
      if (this.enemyManager) {
        this.enemyManager.activeEnemies.forEach((enemy_ch, index) => {
          this.physics.add.overlap(this.playerCharacter.chain, enemy_ch, () => this.enemyManager.destroyEnemy(index));
        });
      }
      if (this.enemyBossManager) {
        this.enemyBossManager.activeEnemies.forEach((enemy_ch, index) => {
          this.physics.add.overlap(this.playerCharacter.chain, enemy_ch, () => this.enemyBossManager.destroyEnemy(index));
        });
      }
    }

    if (this.enemyManager && this.playerCharacter && this.playerCharacter.block) {
      this.enemyManager.activeEnemies.forEach((enemy_ch, index) => {
        this.enemyChannel[index] = this.physics.add.collider(this.playerCharacter.block, enemy_ch);
      });
    }

    if (this.enemyBossManager && this.playerCharacter && this.playerCharacter.block) {
      this.enemyBossManager.activeEnemies.forEach((enemy_ch, index) => {
        this.enemyBossChannel[index] = this.physics.add.collider(this.playerCharacter.block, enemy_ch);
      });

      this.enemyBossManager.projectiles.forEach((proj, index) => {
        this.enemyBossChannelProj[index] = this.physics.add.collider(this.playerCharacter.block, proj);
        this.physics.add.overlap(this.playerCharacter.sprite, proj, this.hitObstacle);
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

    if (this.enemyBossManager) {
      this.enemyBossManager.update()
    }
  }

  updateScore = () => {
    this.score = Math.floor((this.playerCharacter.getTravelDistance() - constants.GAME.START_POS) * constants.GAME.SCORE_MULTIPLIER)

    if (this.userInterface) {
      this.userInterface.updateScoreText(this.score)
    }
  }

  hitObstacle = () => {
    if (!this.isGameOver) {
      this.audioRefs.loseSfx.play()
    }
    this.isGameOver = true
    this.playerCharacter.die()

    if (this.userInterface) {
      // this.userInterface.restartButton.setVisible(true)
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
  restartGame = async () => {
    this.scene.remove("runner")

    const { ethereum } = window;
    if (!ethereum) {
      console.error("No web3 provider detected");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const pay_contract = new ethers.Contract(rewardPool.address, rewardPool.abi, signer);
    try {
      const tx = await pay_contract.setStageClear(this.tokenId);
      console.log("Clear Stage flag set successfully", tx);
    } catch (err) {
      console.error("Clear Stage glag set not successfully", err);
    }
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
