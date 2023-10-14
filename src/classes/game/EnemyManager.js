import * as utils from "../../utils.js"
import * as constants from "../../constants.js"

export default class EnemyManager {
  constructor(runnerScene, player, stageData) {
    this.runnerScene = runnerScene
    this.player = player
    this.stageData = stageData
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
      this.stageData.forEach((enemy) => {
        if (enemy[2] === "enemy") {
          this.createEnemy(index, parseInt(enemy[0].hex), parseInt(enemy[1].hex), 80, 80, enemy[2])
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
      -Number(posY) + Number(constants.GROUND.Y_POS),
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