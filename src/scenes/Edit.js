import Phaser from 'phaser'
import { game, web3Connection } from "../index.js"
import * as constants from "../constants.js"
import CustomContainerButton from "../classes/interfaceElements/CustomContainerButton.js"
import Picker from "../classes/interfaceElements/Picker.js"
import * as assets from "../classes/utility/Assets.js"
import WebFontFile from "../classes/utility/WebFontFile.js"
import { ethers } from "ethers"
import Toastify from 'toastify-js'

// Main menu and customization scene
export default class Edit extends Phaser.Scene {
  constructor() {
    super('edit')

    this.selectSFX
    this.switchSFX

    this.mainMenuItems = []
    this.formData = {
      filename: "",
      x: "",
      y: "",
      size_x: "",
      size_y: "",
      obj_type: ""
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

    this.load.image('buttonConnectWalletUp', assets.ui.buttonConnectWalletUpImage)
    this.load.image('buttonConnectWalletDown', assets.ui.buttonConnectWalletDownImage)
    this.load.image('buttonDisconnectUp', assets.ui.buttonDisconnectUpImage)
    this.load.image('buttonDisconnectDown', assets.ui.buttonDisconnectDownImage)

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
  }


  initMainMenu = async () => {
    // const node = await IPFS.create()

    this.formData.x = rexUI.add.textedit(100, 100, 100, 20, { text: '300' })
      .on('textchange', function (textObject, text) {
        console.log(`X changed to ${text}`);
      })

    // text input for y
    this.formData.y = rexUI.add.textedit(100, 130, 100, 20, { text: '0' })
      .on('textchange', function (textObject, text) {
        console.log(`Y changed to ${text}`);
      })

    // text input for size_x
    this.formData.size_x = rexUI.add.textedit(100, 160, 100, 20, { text: '80' })
      .on('textchange', function (textObject, text) {
        console.log(`Size X changed to ${text}`);
      })

    // text input for size_y
    this.formData.size_y = rexUI.add.textedit(100, 190, 100, 20, { text: '80' })
      .on('textchange', function (textObject, text) {
        console.log(`Size Y changed to ${text}`);
      })

    // text input for obj_type
    this.formData.obj_type = rexUI.add.textedit(100, 220, 100, 20, { text: 'enemy' })
      .on('textchange', function (textObject, text) {
        console.log(`Object type changed to ${text}`);
      })

    const saveButton = new CustomContainerButton(this, constants.GAME.CANVAS_WIDTH / 2, constants.GAME.CANVAS_HEIGHT / 2 + 225, 'buttonPlayUp', 'buttonPlayDown', 1)
    this.add.existing(saveButton)
    saveButton.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, async () => {
        // generate YAML data
        let yamlData = this.generateYAMLData(); // Implement this function to generate your YAML data

        // add file to IPFS
        // const fileAdded = await node.add({
        //   path: this.formData.filename.text + '.yaml',
        //   content: Buffer.from(yamlData)
        // });
        // console.log('Added file:', fileAdded.path, fileAdded.cid);

        this.scene.start('menu')
        this.selectSFX.play()
      })

    // Save main menu items in group for visibility toggling
    this.mainMenuItems.push(
      saveButton
    )
  }

  generateYAMLData = () => {
    const data = {
      x: this.formData.x.text,
      y: this.formData.y.text,
      size_x: this.formData.size_x.text,
      size_y: this.formData.size_y.text,
      obj_type: this.formData.obj_type.text,
    }

    return yaml.dump(data)
  }
}