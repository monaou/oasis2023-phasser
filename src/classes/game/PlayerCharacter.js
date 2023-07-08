import * as constants from "../../constants.js"
import * as utils from "../../utils.js"

export default class PlayerCharacter {
  constructor(runnerScene, audioRefs, spriteType = 'dino') {
    this.runnerScene = runnerScene
    this.audioRefs = audioRefs
    this.runSpeed = 0;//constants.PLAYER.BASE_RUN_SPEED
    this.sprite
    this.actionStatus = 0;
    this.canGuard = true;
    this.canAttack = true;
    this.canSpecial = false;
    this.block
    this.chain

    // Set spriteType to 'dino' if no custom art selected
    this.spriteType =
      spriteType === 'pixelDinoGreen' ||
        spriteType === 'pixelDinoBlue' ||
        spriteType === 'pixelDinoRed' ?
        'dino' : spriteType

    this.initPlayer()
  }

  // Init animations and player base settings
  initPlayer = () => {
    if (this.spriteType === 'dino') {
      // Set up collision
      this.sprite = this.runnerScene.physics.add.sprite(constants.GAME.START_POS, constants.GAME.START_HEIGHT, this.spriteType)
      this.sprite.body.setSize(50, 90, 0, 0)
      this.sprite.body.setOffset(25, 0)

      // Only add animations for default dino characters
      this.runnerScene.anims.create({
        key: 'run',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 1, end: 2 }),
        frameRate: 10,
        repeat: -1
      })

      this.runnerScene.anims.create({
        key: 'runFast',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 1, end: 2 }),
        frameRate: 15,
        repeat: -1
      })

      this.runnerScene.anims.create({
        key: 'die',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 3, end: 3 }),
        frameRate: 0,
        repeat: 0
      })

      this.runnerScene.anims.create({
        key: 'win',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 4, end: 4 }),
        frameRate: 0,
        repeat: 0
      })

      this.runnerScene.anims.create({
        key: 'jump',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 4, end: 4 }),
        frameRate: 0,
        repeat: 0
      })

      this.runnerScene.anims.create({
        key: 'fall',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 5, end: 5 }),
        frameRate: 0,
        repeat: 0
      })

      this.runnerScene.anims.create({
        key: 'guard',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 3, end: 3 }),
        frameRate: 0,
        repeat: 0
      })

      this.runnerScene.anims.create({
        key: 'normal_attack',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 3, end: 3 }),
        frameRate: 0,
        repeat: 0
      })

      this.runnerScene.anims.create({
        key: 'special_attack',
        frames: this.runnerScene.anims.generateFrameNumbers(this.spriteType, { start: 3, end: 3 }),
        frameRate: 0,
        repeat: 0
      })
      this.playRunAnim()
    } else {
      // Initialize custom art character
      const scale = utils.getIdealSpriteScale(this.runnerScene.textures.get(this.spriteType), false)
      this.sprite = this.runnerScene.physics.add.sprite(constants.GAME.START_POS, constants.GAME.START_HEIGHT, this.spriteType).setScale(scale, scale)
    }

    this.sprite.setBounce(constants.PLAYER.BOUNCE)
    this.sprite.setDepth(constants.PLAYER.RENDER_DEPTH)
    this.setRunSpeed(this.runSpeed)
  }

  tryJump = () => {
    if (!this.runnerScene.isGameOver && this.sprite.body.touching.down && this.actionStatus === 0) {
      this.sprite.setVelocityY(-1 * constants.PLAYER.JUMP_STRENGTH)
      this.audioRefs.jumpSfx.play()
    }
  }

  turnLeft = () => {
    this.sprite.setScale(-1 * Math.abs(this.sprite.scaleX), this.sprite.scaleY); // 反転して左を向く
  }

  turnRight = () => {
    this.sprite.setScale(Math.abs(this.sprite.scaleX), this.sprite.scaleY); // 反転して右を向く
  }


  tryWalkRight = () => {
    this.turnRight()
    if (!this.runnerScene.isGameOver && this.actionStatus === 0) {
      if (this.sprite.body.touching.down) {
        this.sprite.setVelocityX(constants.PLAYER.BASE_RUN_SPEED)
      } else {
        this.sprite.setVelocityX(constants.PLAYER.BASE_RUN_SPEED / 2)
      }
      this.audioRefs.walkSfx.play()
    }
  }

  tryWalkLeft = () => {
    this.turnLeft()
    if (!this.runnerScene.isGameOver && this.actionStatus === 0) {
      if (this.sprite.body.touching.down) {
        this.sprite.setVelocityX(-1 * constants.PLAYER.BASE_RUN_SPEED)
      } else {
        this.sprite.setVelocityX(-1 * constants.PLAYER.BASE_RUN_SPEED / 1.5)
      }
      this.audioRefs.walkSfx.play()
    }
  }

  tryStopWalk = () => {
    if (!this.runnerScene.isGameOver && this.sprite.body.touching.down) {
      this.sprite.setVelocityX(0)
    }
  }


  tryGuard = () => {
    if (!this.runnerScene.isGameOver && this.canGuard) {
      // 攻撃判定のオブジェクトを生成
      const blockPositionX = this.sprite.scaleX > 0
        ? this.sprite.x + this.sprite.width / 2 + 50 // キャラクターが右を向いている場合
        : this.sprite.x - this.sprite.width / 2 - 50; // キャラクターが左を向いている場合

      const block = this.runnerScene.physics.add.sprite(
        blockPositionX,
        this.sprite.y,
        'block'
      ).setScale(this.sprite.scaleX / 7, this.sprite.scaleY / 7);
      block.body.setAllowGravity(false);
      this.block = block;

      this.canGuard = false;
      this.canAttack = false;
      this.actionStatus = 1;
      this.audioRefs.walkSfx.play()
    }
  }

  tryGuardStop = () => {
    if (!this.runnerScene.isGameOver && this.actionStatus === 1) {
      this.block.destroy()
      this.canGuard = true;
      this.canAttack = true;
      this.actionStatus = 0;
      this.audioRefs.walkSfx.play()
    }
  }

  // 追加
  tryNormalAttack = () => {
    if (!this.canAttack) {
      return; // canAttackがfalseの場合はchainを生成しない
    }
    if (this.canSpecial) {
      this.trySpecialAttack()
      return;
    }

    // 攻撃判定のオブジェクトを生成
    const chainPositionX = this.sprite.scaleX > 0
      ? this.sprite.x + this.sprite.width / 2 + 200 // キャラクターが右を向いている場合
      : this.sprite.x - this.sprite.width / 2 - 200; // キャラクターが左を向いている場合

    const chain = this.runnerScene.physics.add.sprite(
      chainPositionX,
      this.sprite.y,
      'chain'
    ).setScale(this.sprite.scaleX / 7, this.sprite.scaleY / 2);

    chain.body.setAllowGravity(false);
    this.chain = chain

    this.canAttack = false; // canAttackをfalseに設定して次のchainを生成するのを防ぐ
    this.canGuard = false;

    setTimeout(() => {
      this.actionStatus = 0;
      this.chain.destroy(); // 500ms後にchainを消す
      this.canAttack = true; // canAttackをtrueに設定して次のchainを生成できるようにする
      this.canGuard = true;
    }, 500);
  }

  // 追加
  destroyRock = (rock) => {
    rock.destroy(); // 岩を壊す
    this.chain.destroy(); // chainも消す

    // スパークのエフェクトを作成
    var particles = this.runnerScene.add.particles('spark');

    var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    emitter.startFollow(rock);
    setTimeout(() => emitter.stop(), 200); // 200ms後にエフェクトを停止
  }


  trySpecialAttack = () => {
    if (!this.runnerScene.isGameOver) {
      this.actionStatus = 3;
    }
  }

  getTravelDistance = () => {
    return this.sprite.x
  }

  die = () => {
    this.sprite.anims.play('die', false)
    this.setRunSpeed(0)
  }
  win = () => {
    this.sprite.anims.play('win', false)
    this.setRunSpeed(0)
  }

  setRunSpeed = (speed) => {
    this.runSpeed = speed
    this.sprite.setVelocityX(speed)
  }

  // Play run anim if default character
  playRunAnim = () => {
    if (this.spriteType !== 'dino') { return }

    const anim = this.runSpeed >= 1400 ? 'runFast' : 'run'
    this.sprite.anims.play(anim, true)
  }

  // Update animation depending on velocity
  update() {
    if (this.spriteType !== 'dino') { return }

    // Set jump animation
    if (this.sprite.body.velocity.y > 0) {
      this.sprite.anims.play('fall', true)
    } else if (this.sprite.body.velocity.y < 0) {
      this.sprite.anims.play('jump', true)
    } else if (this.actionStatus === 1) {
      this.sprite.anims.play('guard', true)
    } else if (this.actionStatus === 2) {
      this.sprite.anims.play('normal_attack', true)
    } else if (this.actionStatus === 3) {
      this.sprite.anims.play('special_attack', true)
    } else {
      this.playRunAnim()
    }
  }
}