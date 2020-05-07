export default class BootScene extends Phaser.Scene {
  public init(): void {
    this.scale.refresh();
  }

  public preload(): void {
    this.load.audio("bgm", "assets/audio/bgm.ogg");

    /**/
  }

  public create(): void {
    this.scene.start("PreloadScene");
    const music = this.sound.add("bgm") as Phaser.Sound.WebAudioSound;
    music.setLoop(true);
    music.play();
  }
}
