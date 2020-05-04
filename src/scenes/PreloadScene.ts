import BgmPlayer from '../utils/BgmPlayer';

export default class PreloadScene extends Phaser.Scene {
  private preloadBarSprite: Phaser.GameObjects.Sprite = null;
  private preloadFrameSprite: Phaser.GameObjects.Sprite = null;

  public init(): void {
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#000000');
  }

  public preload(): void {
    /**/
    this.onCompleteLoadAll();
  }

  public create(): void {
    /**/
  }

  private onCompleteLoadAll(): void {
    this.cameras.main.fade(100, 0, 0, 0, true, this.startGame, this);
  }

  private startGame(): void {
    this.scene.start('TitleScene');

    BgmPlayer.instance.init();
    /*
    BgmPlayer.instance.play([Assets.Audio.AudioBgm.getMP3(), Assets.Audio.AudioBgm.getOGG()]);
    */
  }
}