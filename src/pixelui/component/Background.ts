import { PixelUI, ThemeOptions } from "..";

export class Background extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, theme?: ThemeOptions) {
    super(scene, 0, 0);

    const themeColorDarkShade = Phaser.Display.Color.HexStringToColor(
      PixelUI.theme(theme).colorLightShade || "#000000"
    );
    scene.cameras.main.setBackgroundColor(themeColorDarkShade.color);

    const rectangle = scene.add.rectangle(
      0,
      0,
      GAME_WIDTH,
      GAME_HEIGHT,
      themeColorDarkShade.color
    );
    rectangle.setOrigin(0, 0);
  }
}
