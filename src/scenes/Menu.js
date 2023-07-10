import Phaser from 'phaser'
import * as constants from "../constants.js"
import CustomContainerButton from "../classes/interfaceElements/CustomContainerButton.js"
import Picker from "../classes/interfaceElements/Picker.js"
import * as assets from "../classes/utility/Assets.js"
import WebFontFile from "../classes/utility/WebFontFile.js"
import { ethers } from "ethers"
import Toastify from 'toastify-js'
import Web3Connection from "../classes/utility/Web3Connection.js";

// Main menu and customization scene
export default class Menu extends Phaser.Scene {
  constructor() {
    super('menu')

    this.selectSFX
    this.switchSFX

    this.networkText
    this.contractAddressText
    this.mainMenuItems = []
    this.customizationMenuItems = []
    this.imageContractAddress = ""
    this.imageTokenId = ""
    this.newWeb3Connection = new Web3Connection()
    this.Web3Network
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
    this.setMainMenuActive(true)

    this.networkText = this.add.text(15, 15, 'Please connect Wallet', { fontSize: '20px', fill: '#FFF', fontFamily: 'Aldrich' })
  }

  initMainMenu = () => {
    const startButton = new CustomContainerButton(this, constants.GAME.CANVAS_WIDTH / 2, constants.GAME.CANVAS_HEIGHT / 2 + 225, 'buttonPlayUp', 'buttonPlayDown', 1)
    this.add.existing(startButton)
    startButton.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.scene.start('runner')
        this.selectSFX.play()
      })

    const topButtonsHeight = constants.GAME.CANVAS_HEIGHT / 2 - 200
    this.connectWalletButton = new CustomContainerButton(this, 125, topButtonsHeight, 'buttonConnectWalletUp', 'buttonConnectWalletDown', 1)
    this.add.existing(this.connectWalletButton)
    this.connectWalletButton.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, async () => {
        await this.newWeb3Connection.initWeb3()
        this.Web3Network = await this.newWeb3Connection.web3Provider.getNetwork()
        this.updateNetworkText(this.Web3Network)
        this.setMainMenuActive(true)
        this.selectSFX.play()
      })

    this.disconnectButton = new CustomContainerButton(this, 125, topButtonsHeight, 'buttonDisconnectUp', 'buttonDisconnectDown', 1)
    this.add.existing(this.disconnectButton)
    this.disconnectButton.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, async() => {
        await this.newWeb3Connection.disconnectWallet()
        this.setMainMenuActive(true)
        this.selectSFX.play()
      })
    this.disconnectButton.setVisible(false)

    // Save main menu items in group for visibility toggling
    this.mainMenuItems.push(
      startButton
    )
  }


  setMainMenuActive = (setMainMenuActive) => {
    if (setMainMenuActive) {
      this.mainMenuItems.forEach(m => m.setVisible(true))
      this.customizationMenuItems.forEach(c => c.setVisible(false))

      if (!!this.newWeb3Connection.web3Network) {
        this.setConnectWalletButtonVisibility(false)
      }
    } else {
      this.mainMenuItems.forEach(m => m.setVisible(false))
      this.customizationMenuItems.forEach(c => c.setVisible(true))
    }
  }

  updateNetworkText = (web3Network) => {
    if (!this.networkText) { return }
    const baseString = "Connected to: "
    const chainId = web3Network.chainId
    let networkName = web3Network.name

    // Turn recognized network name into more readable format
    if (networkName === 'unknown') {
      if (web3Network.chainId === constants.GAME.HMV_TEST_CHAINID) {
        networkName = "Homeverse Testnet"
      } else if (web3Network.chainId === constants.GAME.HMV_MAIN_CHAINID) {
        networkName = "Homeverse Mainnet"
      }
    } else if (networkName === 'homestead') {
      networkName = "Ethereum Mainnet"
    } else if (networkName === 'matic') {
      networkName = "Polygon Mainnet"
    }
    this.networkText.setText(`${baseString} ${networkName} (${chainId})`)
  }

  isValidAddress = (address) => {
    return ethers.utils.isAddress(address)
  }

  isValidId = (tokenId) => {
    if (typeof tokenId != "string") { return false }
    if (tokenId.substring(0, 2) === '0x') { return false }
    return !isNaN(tokenId) && !isNaN(parseFloat(tokenId))
  }

  setConnectWalletButtonVisibility = (setVisible) => {
    if (!this.connectWalletButton) { return }
    this.connectWalletButton.setVisible(setVisible)

    if (!this.disconnectButton) { return }
    if (setVisible) {
      this.disconnectButton.setVisible(false)
    } else if (!setVisible && !!this.Web3Network) {
      // Only show disconnect button if connected and connect button is hidden
      this.disconnectButton.setVisible(true)
    }
  }
}