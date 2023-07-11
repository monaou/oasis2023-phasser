import * as utils from "../../utils.js"
import * as constants from "../../constants.js"
import fs from 'fs'
import yaml from 'js-yaml'
import obstacles_map from "../../yaml/ipfs_data.yaml"
// import ipfsClient from 'ipfs-http-client'

// const ipfs = ipfsClient('http://localhost:5001') // あなたのIPFS APIのエンドポイントに変更

export default class ObstacleManager {
  constructor(runnerScene, player, stageData) {
    this.runnerScene = runnerScene
    this.player = player
    this.stageData = stageData
    this.activeObstacles = []

    this.initObstacles()
  }

  // Prepare obstacle collision group
  initObstacles = async () => {
    try {
      // // IPFSからYAMLデータを取得
      // const ipfsData = await ipfs.cat('Qm...') // あなたのIPFSハッシュに変更
      // // YAMLをパース
      // const obstacles_map = yaml.load(ipfsData.toString())

      // const obstacles_map = yaml.load(yaml_data)
      // 障害物を生成
      let index = 0
      this.stageData[4].forEach((obstacle) => {
        if (obstacle[4] === "obstacle") {
          this.createObstacle(index, obstacle[0], obstacle[1], obstacle[2], obstacle[3], obstacle[4])
          index++
        }
      })
    } catch (e) {
      console.log('Error while loading obstacles:', e)
    }
  }

  // Create new obstacle at passed x position
  createObstacle = (id, posX, posY, sizeX, sizeY, obj_type) => {
    let obstacleType = obj_type === "obstacle" ? "rockTall" : ""//obj_type

    // Need this to move collision to ground level
    const texture = this.runnerScene.textures.get(obstacleType)
    const scale = utils.getIdealSpriteScale(texture, true)
    const offset = texture.getSourceImage().height

    // Move spawn trigger to next position
    const obstacle = this.runnerScene.physics.add.sprite(
      Number(posX) + constants.GAME.START_POS,
      Number(posY) + constants.GAME.START_HEIGHT + offset / 2,
      obstacleType
    )
    // Adjust size, scale and offsets depending on obstacle type
    obstacle.setDisplaySize(sizeX, sizeY, 0, 0)
    // obstacle.setOffset(0, offset)

    this.activeObstacles[id] = obstacle
  }

  // Remove first obstacle if over instance limit
  destroyObstacle = (id) => {
    this.activeObstacles[id].destroy()
  }

  // Check for player position on update to determine if new Obstacle should spawn
  update() {
  }
}