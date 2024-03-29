import * as utils from "../../utils.js"
import * as constants from "../../constants.js"
import fs from 'fs'
import yaml from 'js-yaml'
import coins_map from "../../yaml/ipfs_data.yaml"
// import ipfsClient from 'ipfs-http-client'

// const ipfs = ipfsClient('http://localhost:5001') // あなたのIPFS APIのエンドポイントに変更

export default class CoinManager {
  constructor(runnerScene, player, stageData) {
    this.runnerScene = runnerScene
    this.player = player
    this.stageData = stageData
    this.activeCoins = []

    this.initCoins()
  }

  // Prepare coin collision group
  initCoins = async () => {
    try {
      // // IPFSからYAMLデータを取得
      // const ipfsData = await ipfs.cat('Qm...') // あなたのIPFSハッシュに変更
      // // YAMLをパース
      // const coins_map = yaml.load(ipfsData.toString())

      // const coins_map = yaml.load(yaml_data)
      // 障害物を生成
      let index = 0
      this.stageData.forEach((coin) => {
        if (coin[2] === "coin") {
          this.createCoin(index, coin[0], coin[1], 80, 80, coin[2])
          index++
        }
      })
    } catch (e) {
      console.log('Error while loading coins:', e)
    }
  }

  // Create new coin at passed x position
  createCoin = (id, posX, posY, sizeX, sizeY, obj_type) => {
    let coinType = obj_type//obj_type

    // Need this to move collision to ground level
    const texture = this.runnerScene.textures.get(coinType)
    const scale = utils.getIdealSpriteScale(texture, true)
    const offset = texture.getSourceImage().height

    // Move spawn trigger to next position
    const coin = this.runnerScene.physics.add.sprite(
      Number(posX) + constants.GAME.START_POS,
      -Number(posY) + Number(constants.GROUND.Y_POS),
      coinType
    )
    // Adjust size, scale and offsets depending on coin type
    coin.setDisplaySize(sizeX, sizeY, 0, 0)
    coin.body.setImmovable(true);
    coin.body.setAllowGravity(false);
    // coin.setOffset(0, offset)

    this.activeCoins[id] = coin
  }

  // Remove first coin if over instance limit
  destroyCoin = (id) => {
    this.activeCoins[id].destroy()
  }

  // Check for player position on update to determine if new coin should spawn
  update() {
  }
}