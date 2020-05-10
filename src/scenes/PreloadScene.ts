import * as Assets from "../assets";
import BgmPlayer from "../utils/BgmPlayer";
import { AssetLoader } from "../utils/AssetLoader";
import { LoaderProgress } from "../widget/LoaderProgress";

export default class PreloadScene extends Phaser.Scene {
  public init(): void {
    /* */
  }

  public preload(): void {
    this.load.image(
      Assets.Images.ImagesProgressBar.getName(),
      Assets.Images.ImagesProgressBar.getPNG()
    );
    this.load.image(
      Assets.Images.ImagesProgressFrame.getName(),
      Assets.Images.ImagesProgressFrame.getPNG()
    );
  }

  public create(): void {
    const progressWidget = new LoaderProgress(
      this,
      this.add.sprite(0, 0, Assets.Images.ImagesProgressBar.getName()),
      this.add.sprite(0, 0, Assets.Images.ImagesProgressFrame.getName())
    );
    progressWidget.setPosition(
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );
    this.children.add(progressWidget);

    progressWidget
      .load(() => {
        AssetLoader.loadAllAssets(this.load);
      })
      .then(() => {
        this.onCompleteLoadAll();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private onCompleteLoadAll(): void {
    const boot = this.startGame.bind(this);
    this.cameras.main.fade(100, 0, 0, 0, true, boot, this);
  }

  private startGame(): void {
    this.scene.start("TitleScene");

    BgmPlayer.instance.init();
    BgmPlayer.instance.play([
      Assets.Audio.AudioBgm.getMP3(),
      Assets.Audio.AudioBgm.getOGG(),
    ]);
  }
}
