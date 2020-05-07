import * as Assets from "../assets";

export default class BootScene extends Phaser.Scene {
  public init(): void {
    this.scale.refresh();
  }

  public preload(): void {
    console.log(Assets.Audio.AudioBgm.getOGG());
    this.load.audio(
      Assets.Audio.AudioBgm.getName(),
      Assets.Audio.AudioBgm.getOGG()
    );
    this.load.image(
      Assets.Images.ImagesProgressBar.getName(),
      Assets.Images.ImagesProgressBar.getPNG()
    );
  }

  public create(): void {
    this.scene.start("PreloadScene");
    const music = this.sound.add(
      Assets.Audio.AudioBgm.getName()
    ) as Phaser.Sound.WebAudioSound;

    music.setLoop(true);
    music.play();
  }
}
