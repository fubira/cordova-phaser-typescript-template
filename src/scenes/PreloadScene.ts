import * as Assets from "@/assets";
import * as PixelUI from "@/pixelui";
import { AssetLoader } from "@/utils/AssetLoader";

export default class PreloadScene extends Phaser.Scene {
  public init(): void {
    /**/
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
    const progress = PixelUI.add.loadingProgerss(
      this,
      Assets.Images.ImagesProgressBar.getName(),
      Assets.Images.ImagesProgressFrame.getName()
    );
    progress
      .start(() => {
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
    this.cameras.main.fade(250, 0, 0, 0, true, boot, this);
  }

  private startGame(): void {
    this.scene.start("TitleScene");
  }
}
