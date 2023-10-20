import Phaser from 'phaser'
import * as constants from "../constants.js"
import CustomContainerButton from "../classes/interfaceElements/CustomContainerButton.js"
import * as assets from "../classes/utility/Assets.js"
import WebFontFile from "../classes/utility/WebFontFile.js"
import { startGame } from '../api/interface.js';

// Main menu and customization scene
export default class Menu extends Phaser.Scene {
  constructor() {
    super('menu')

    this.selectSFX
    this.switchSFX

    this.mainMenuItems = []
    this.customizationMenuItems = []
    this.showStageText
    this.showNameText
  }

  init(data) {
    if (data.tokenId) {
      this.stageId = data.tokenId; // ここでtokenIdを取得
      console.log("open modal stageId", this.stageId);
    }
    if (data.address) {
      this.address = data.address; // ここでtokenIdを取得
      console.log("open modal address", this.address);
    }

  }

  // Preload all images used in the menu
  preload() {
    this.load.image('background', assets.img.backgroundImage)
    this.load.image('cloudLayer', assets.img.cloudLayerImage)
    this.load.image('backLayer', assets.img.backLayerImage)
    this.load.audio('select', assets.audio.selectAudio)
    this.load.audio('switch', assets.audio.switchAudio)

    this.load.image('buttonPlayUp', assets.ui.buttonPlayUpImage)
    this.load.image('buttonPlayDown', assets.ui.buttonPlayDownImage)
    this.load.addFile(new WebFontFile(this.load, 'Aldrich'))
  }

  // Initialize menu on scene start
  create() {
    this.selectSFX = this.sound.add('select')
    this.switchSFX = this.sound.add('switch')

    // Set up background layers
    this.add.image(constants.GAME.CANVAS_WIDTH / 2, constants.GAME.CANVAS_HEIGHT / 2, 'background')
    this.add.image(constants.GAME.CANVAS_WIDTH / 2, constants.GAME.CANVAS_HEIGHT / 2 + 100, 'cloudLayer')
    this.add.image(constants.GAME.CANVAS_WIDTH / 2, constants.GAME.CANVAS_HEIGHT / 2, 'backLayer')

    // Init both menus and set main menu to active
    this.initMainMenu()
    this.setMainMenuActive(true)
  }

  initMainMenu = () => {
    const startButton = new CustomContainerButton(this, constants.GAME.CANVAS_WIDTH / 2, constants.GAME.CANVAS_HEIGHT / 2 + 225, 'buttonPlayUp', 'buttonPlayDown', 1)
    this.add.existing(startButton)
    startButton.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, async () => {
        try {
          // TODO
          const { stage_data, gameInstanceIdObj } = await startGame(this.address, this.stageId);
          if (stage_data) {
            const gameInstanceIdNumber = parseInt(gameInstanceIdObj.hex, 16);
            this.scene.start('runner', { stage_data: stage_data, tokenId: this.stageId, gameInstanceId: gameInstanceIdNumber });
          }
        } catch (err) {
          console.error("An error occurred while fetching stages", err);
        }

        this.selectSFX.play()
      })

    // Save main menu items in group for visibility toggling
    this.mainMenuItems.push(
      startButton
    )
  }

  setMainMenuActive = (setMainMenuActive) => {
    if (setMainMenuActive) {
      this.mainMenuItems.forEach(m => m.setVisible(true))
      this.customizationMenuItems.forEach(c => c.setVisible(false))
    } else {
      this.mainMenuItems.forEach(m => m.setVisible(false))
      this.customizationMenuItems.forEach(c => c.setVisible(true))
    }
  }

}