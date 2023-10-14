import * as utils from "../../utils.js"
import * as constants from "../../constants.js"

export default class StoneManager {
  constructor(runnerScene, player, stageData) {
    this.runnerScene = runnerScene
    this.player = player
    this.stageData = stageData
    this.activeStones = []

    this.initStones()
  }

  // Prepare stone collision group
  initStones = async () => {
    try {
      // // IPFSからYAMLデータを取得
      // const ipfsData = await ipfs.cat('Qm...') // あなたのIPFSハッシュに変更
      // // YAMLをパース
      // const stones_map = yaml.load(ipfsData.toString())

      // const stones_map = yaml.load(yaml_data)
      // 障害物を生成
      let index = 0
      this.stageData.forEach((stone) => {
        if (stone[2] === "stone") {
          this.createStone(index, stone[0], stone[1], 80, 80, stone[2])
          index++
        }
      })
    } catch (e) {
      console.log('Error while loading stones:', e)
    }
  }

  // Create new stone at passed x position
  createStone = (id, posX, posY, sizeX, sizeY, obj_type) => {
    let stoneType = obj_type

    // Need this to move collision to ground level
    const texture = this.runnerScene.textures.get(stoneType)
    const scale = utils.getIdealSpriteScale(texture, true)
    const offset = texture.getSourceImage().height

    // Move spawn trigger to next position
    const stone = this.runnerScene.physics.add.sprite(
      Number(posX) + constants.GAME.START_POS,
      -Number(posY) + Number(constants.GROUND.Y_POS),
      stoneType
    )
    // Adjust size, scale and offsets depending on stone type
    stone.setDisplaySize(sizeX, sizeY, 0, 0)
    stone.body.setImmovable(true);
    stone.body.setAllowGravity(false);

    // stone.setOffset(0, offset)

    this.activeStones[id] = stone
  }

  // Remove first stone if over instance limit
  destroyStone = (id) => {
    this.activeStones[id].destroy()
  }

  // Check for player position on update to determine if new stone should spawn
  update() {
  }
}