import * as constants from "../../constants.js"
import fs from 'fs'
import yaml from 'js-yaml'
import map from "../../yaml/ipfs_data.yaml"

export default class GroundManager {
  constructor(runnerScene, player) {
    this.runnerScene = runnerScene
    this.player = player
    this.platforms
    this.activePlatforms = []
    this.posX = 2960

    this.initGround()
  }

  // Initialize first two platforms
  initGround =  async () => {
    try {
      // // IPFSからYAMLデータを取得
      // const ipfsData = await ipfs.cat('Qm...') // あなたのIPFSハッシュに変更
      // // YAMLをパース
      // const enemies_map = yaml.load(ipfsData.toString())

      // const enemies_map = yaml.load(yaml_data)

      map.forEach((v) => {
        this.posX = v.x > this.posX ? v.x * 2 : this.posX;
      })
    } catch (e) {
      console.log('Error while loading enemies:', e)
    }
    this.platforms = this.runnerScene.physics.add.staticGroup()

    // Start out with 2 platforms
    this.createPlatform()
  }

  // Seemlessly create next platform
  createPlatform = () => {
    for (let platformCounter = 0; constants.GROUND.FIRST_PLATFORM_POS + (platformCounter - 1) * constants.GROUND.IMAGE_LENGTH < this.posX; platformCounter++){
      this.platforms.create(constants.GROUND.FIRST_PLATFORM_POS + platformCounter * constants.GROUND.IMAGE_LENGTH, constants.GROUND.Y_POS, 'ground')
    }
  }

  // Check player xPos on update to spawn and clean up platforms if needed
  update() {
  }
}