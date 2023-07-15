import * as utils from "../../utils.js"
import * as constants from "../../constants.js"
import fs from 'fs'
import yaml from 'js-yaml'
import enemies_map from "../../yaml/ipfs_data.yaml"
// import ipfsClient from 'ipfs-http-client'

// const ipfs = ipfsClient('http://localhost:5001') // あなたのIPFS APIのエンドポイントに変更

export default class EnemyBossManager {
  constructor(runnerScene, player, stageData) {
    this.runnerScene = runnerScene
    this.player = player
    this.stageData = stageData
    this.activeEnemies = []
    this.projectiles = []
    this.spawnCounter = 0

    this.initEnemies()
  }

  // Prepare enemy collision group
  initEnemies = async () => {
    try {
      // // IPFSからYAMLデータを取得
      // const ipfsData = await ipfs.cat('Qm...') // あなたのIPFSハッシュに変更
      // // YAMLをパース
      // const enemies_map = yaml.load(ipfsData.toString())

      // const enemies_map = yaml.load(yaml_data)
      // 障害物を生成
      let index = 0
      this.stageData[4].forEach((enemy) => {
        if (enemy[4] === "enemy_boss") {
          this.createEnemy(index, enemy[0], enemy[1], enemy[2], enemy[3], enemy[4])
          index++
        }
      })
    } catch (e) {
      console.log('Error while loading enemies:', e)
    }
  }

  // Create new enemy at passed x position
  createEnemy = (id, posX, posY, sizeX, sizeY, obj_type) => {
    let enemyType = obj_type
  
    // Need this to move collision to ground level
    const texture = this.runnerScene.textures.get(enemyType)
    const scale = utils.getIdealSpriteScale(texture, true)
    const offset = texture.getSourceImage().height
  
    // Move spawn trigger to next position
    const enemy = this.runnerScene.physics.add.sprite(
      Number(posX) + constants.GAME.START_POS,
      Number(posY) + constants.GAME.START_HEIGHT + offset / 2,
      enemyType
    )
    // Adjust size, scale and offsets depending on enemy type
    enemy.setDisplaySize(sizeX, sizeY, 0, 0)
    // enemy.setOffset(0, offset)

    // Add random movement to the enemy boss
    let randomDirection = Math.random() < 0.5 ? -1 : 1; // -1 or 1 for random direction
    enemy.setVelocityX(randomDirection * constants.ENEMY.BOSS_SPEED)

    // Set boss enemy to bounce on world bounds
    enemy.setCollideWorldBounds(true)
    enemy.setBounce(1, 1)

    this.activeEnemies[id] = enemy
  
    this.activeEnemies[id] = enemy
  }
  // Spawn random projectiles from enemy boss towards player
  spawnProjectiles = () => {
    this.activeEnemies.forEach((enemy, index) => {
      if(enemy) {
        let projectile = this.runnerScene.physics.add.sprite(
          enemy.x,
          enemy.y,
          "fire" // Replace with your projectile sprite key
        )
        projectile.body.setAllowGravity(false);
        projectile.setDisplaySize(30, 30, 0, 0)
  
        // Calculate direction towards player
        let directionX = this.player.x - enemy.x
        let directionY = this.player.y - enemy.y
  
        // Normalize the direction vector (convert it to a vector of length 1)
        let directionLength = Math.sqrt(directionX * directionX + directionY * directionY)
        directionX /= directionLength
        directionY /= directionLength
  
        // Set velocity towards player
        projectile.setVelocity(directionX * constants.PROJECTILE.SPEED, directionY * constants.PROJECTILE.SPEED)
  
        // Add to projectiles array
        this.projectiles.push(projectile)
      }
    })
  }

  // Remove first enemy if over instance limit
  destroyEnemy = (id) => {
    this.activeEnemies[id].destroy()
    this.activeEnemies.splice(id, 1); // Remove enemy from the activeEnemies array
  }
  
  // Check for player position on update to determine if new enemy should spawn
  update() {
    this.activeEnemies.forEach((enemy) => {
      if (enemy) {
        // Randomly move the enemy a little
        if (Math.random() < 0.01) {
          const randomX = Math.random() * 100 - 50 // Adjust the range of movement as desired
          enemy.setVelocityX(randomX)
        }
      }
      // Spawn projectiles every certain amount of time
      if (this.spawnCounter % constants.PROJECTILE.SPAWN_TIME === 0) {
        this.spawnProjectiles()
        this.spawnCounter = 1
      } else {
        this.spawnCounter++
      }
    })
  }
}