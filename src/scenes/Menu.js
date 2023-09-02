import Phaser from 'phaser'
import * as constants from "../constants.js"
import CustomContainerButton from "../classes/interfaceElements/CustomContainerButton.js"
import * as assets from "../classes/utility/Assets.js"
import WebFontFile from "../classes/utility/WebFontFile.js"
import { ethers } from "ethers"
import { ERC20_ABI } from '../shared_json/Erc20_abi';
import currency from '../shared_json/currency.json';
import rewardPool from '../shared_json/RewardPool.json';
import stageContract from '../shared_json/StageContract.json';

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
    const modalElement = document.getElementById('phaser-game');
    this.tokenId = modalElement.dataset.tokenid;
    console.log("open modal tokenid", this.tokenId)
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
        const { ethereum } = window;
        if (!ethereum) {
          console.error("No web3 provider detected");
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(stageContract.address, stageContract.abi, signer);
        const oasContract = new ethers.Contract(currency.sandverse, ERC20_ABI, signer);
        try {
          const stage_data = await contract.getStageDetails(this.tokenId)
          const entryFee = (stage_data[2] * 1000000).toString()
          console.log("you must pay entryFee : ", entryFee);

          const tx = await oasContract.approve(rewardPool.address, ethers.utils.parseUnits(entryFee, 6));  // USDCは小数点以下6桁なので、6を指定
          await tx.wait();
          console.log("Allowance set successfully");
        } catch (err) {
          console.error("An error occurred while setting the allowance", err);
        }

        const pay_contract = new ethers.Contract(rewardPool.address, rewardPool.abi, signer);
        try {
          const tx = await pay_contract.stakeEntreeFee(this.tokenId);
          const receipt = await tx.wait();

          const event = receipt.events?.find(e => e.event === 'StakeEntreeFeeEvent');
          if (event) {
            const stage_data = event.args.extraDataArr;
            console.log(stage_data);
            console.log("Pay set successfully");
            this.scene.start('runner', { stage_data: stage_data, tokenId: this.tokenId });
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