import * as PixelUI from "@/pixelui";
import * as Assets from "@/assets";

export default class BootScene extends Phaser.Scene {
  public init(): void {
    this.scale.refresh();
  }

  public preload(): void {
    /**/
  }

  public create(): void {
    PixelUI.theme.update({
      themeDark: false,
      textShadow: true,
      textStroke: true,
      textFontFamily: Assets.CustomWebFonts.FontsKiniroSs.getFamily(),
      textSizeSmall: 30,
      textSizeNormal: 34,
      textSizeLarge: 46,
    });
    this.scene.start("PreloadScene");
  }
}
