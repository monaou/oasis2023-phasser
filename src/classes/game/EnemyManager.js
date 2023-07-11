import * as utils from "../../utils.js"
import * as constants from "../../constants.js"
import fs from 'fs'
import yaml from 'js-yaml'
import enemies_map from "../../yaml/ipfs_data.yaml"
// import ipfsClient from 'ipfs-http-client'

// const ipfs = ipfsClient('http://localhost:5001') // あなたのIPFS APIのエンドポイントに変更

export default class EnemyManager {
  constructor(runnerScene, player, selectedYamlSprite) {
    this.runnerScene = runnerScene
    this.player = player
    this.selectedYamlSprite = selectedYamlSprite
    this.activeEnemies = []

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
      enemies_map.forEach((enemy) => {
        if (enemy.obj_type === "enemy") {
          this.createEnemy(index, enemy.x, enemy.y, enemy.size_x, enemy.size_y, enemy.obj_type)
          index++
        }
      })
    } catch (e) {
      console.log('Error while loading enemies:', e)
    }
  }

  // Create new enemy at passed x position
  createEnemy = (id, posX, posY, sizeX, sizeY, obj_type) => {
    let enemyType = "rockTall"//= obj_type === "enemy" //obj_type

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
    enemy.setVelocityX(-constants.PLAYER.BASE_RUN_SPEED / 10)
    // enemy.setOffset(0, offset)

    this.activeEnemies[id] = enemy
  }

  // Remove first enemy if over instance limit
  destroyEnemy = (id) => {
    this.activeEnemies[id].destroy()
  }

  // Check for player position on update to determine if new enemy should spawn
  update() {
    this.activeEnemies.forEach((enemy) => {
      // if (enemy) {
      //   enemy.setVelocityX(-constants.PLAYER.BASE_RUN_SPEED / 10)
      // }
    })
  }
}