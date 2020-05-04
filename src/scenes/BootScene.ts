import * as Logger from 'js-logger';

export default class BootScene extends Phaser.Scene {
  public init(): void {
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#483C46');
    this.scale.refresh();
  }

  public preload(): void {
    /**/
  }

  public create(): void {
    this.scene.start('PreloadScene');
  }
}
