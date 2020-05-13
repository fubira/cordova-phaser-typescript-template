import * as Assets from "@/assets";
import { AssetLoader } from "@/utils/AssetLoader";
import { LoaderProgress, PixelUI } from "@/pixelui";

export default class PreloadScene extends Phaser.Scene {
  public init(): void {
    /* */
    PixelUI.setup({
      themeDark: false,
      textShadow: true,
      textStroke: true,
      textFontFamily: Assets.CustomWebFonts.FontsK8X12.getFamily(),
      textSizeSmall: 30,
      textSizeNormal: 40,
      textSizeLarge: 50,
    });
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
    const progress = new LoaderProgress(
      this,
      this.add.sprite(0, 0, Assets.Images.ImagesProgressBar.getName()),
      this.add.sprite(0, 0, Assets.Images.ImagesProgressFrame.getName())
    );
    progress.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
    this.children.add(progress);

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
