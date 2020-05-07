import * as Assets from "../assets";
import BgmPlayer from "../utils/BgmPlayer";

export default class PreloadScene extends Phaser.Scene {
  private preloadBarSprite: Phaser.GameObjects.Sprite = null;
  private preloadFrameSprite: Phaser.GameObjects.Sprite = null;

  public init(): void {
    /* */
  }

  public preload(): void {
    this.preloadBarSprite = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      Assets.Images.ImagesProgressBar.getName()
    );
    this.preloadBarSprite.setOrigin(0, 0.5);
    this.preloadBarSprite.x -= this.preloadBarSprite.width * 0.5;

    this.preloadFrameSprite = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      Assets.Images.ImagesProgressFrame.getName()
    );

    this.preloadFrameSprite.setOrigin(0.5);

    this.load.on("progress", (value) => {
      console.log(value);
      this.preloadBarSprite.setScale(value, 1.0);
    });

    this.load.on("complete", () => {
      this.onCompleteLoadAll();
    });
  }

  public create(): void {
    /**/
  }

  private startGame(): void {
    this.scene.start("TitleScene");

    BgmPlayer.instance.init();
    /*
    BgmPlayer.instance.play([Assets.Audio.AudioBgm.getMP3(), Assets.Audio.AudioBgm.getOGG()]);
    */
  }

  private onCompleteLoadAll(): void {
    const boot = this.startGame.bind(this);
    this.cameras.main.fade(100, 0, 0, 0, true, boot, this);
  }
}
