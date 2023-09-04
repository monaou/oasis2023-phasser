import * as utils from "../../utils.js"
import * as constants from "../../constants.js"
import fs from 'fs'
import yaml from 'js-yaml'
import goals_map from "../../yaml/ipfs_data.yaml"
// import ipfsClient from 'ipfs-http-client'

// const ipfs = ipfsClient('http://localhost:5001') // あなたのIPFS APIのエンドポイントに変更

export default class GoalManager {
  constructor(runnerScene, player, stageData) {
    this.runnerScene = runnerScene
    this.player = player
    this.stageData = stageData
    this.activeGoals = []

    this.initGoals()
  }

  // Prepare goal collision group
  initGoals = async () => {
    try {
      // // IPFSからYAMLデータを取得
      // const ipfsData = await ipfs.cat('Qm...') // あなたのIPFSハッシュに変更
      // // YAMLをパース
      // const goals_map = yaml.load(ipfsData.toString())

      // const goals_map = yaml.load(yaml_data)
      // 障害物を生成
      let index = 0
      this.stageData.forEach((goal) => {
        if (goal[2] === "goal") {
          this.createGoal(index, goal[0], goal[1], 80, 80, goal[2])
          index++
        }
      })
    } catch (e) {
      console.log('Error while loading goals:', e)
    }
  }

  // Create new goal at passed x position
  createGoal = (id, posX, posY, sizeX, sizeY, obj_type) => {
    let goalType = obj_type

    // Need this to move collision to ground level
    const texture = this.runnerScene.textures.get(goalType)
    const scale = utils.getIdealSpriteScale(texture, true)
    const offset = texture.getSourceImage().height

    // Move spawn trigger to next position
    const goal = this.runnerScene.physics.add.sprite(
      Number(posX) + constants.GAME.START_POS,
      -Number(posY) + Number(constants.GROUND.Y_POS),
      goalType
    )
    // Adjust size, scale and offsets depending on goal type
    goal.setDisplaySize(sizeX, sizeY, 0, 0)
    goal.body.setImmovable(true);
    goal.body.setAllowGravity(false);
    // goal.setOffset(0, offset)

    this.activeGoals[id] = goal
  }

  // Remove first goal if over instance limit
  destroyGoal = (id) => {
    this.activeGoals[id].destroy()
  }

  // Check for player position on update to determine if new goal should spawn
  update() {
  }
}