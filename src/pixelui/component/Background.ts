import * as PixelUI from "../";

export function BackgroundFactory(
  scene: Phaser.Scene,
  color?: string
): Phaser.GameObjects.Rectangle {
  const backgroundColor = color || PixelUI.theme.backgroundColor();
  scene.cameras.main.setBackgroundColor(backgroundColor);

  return scene.add.rectangle(
    scene.cameras.main.centerX,
    scene.cameras.main.centerY,
    GAME_WIDTH,
    GAME_HEIGHT,
    Phaser.Display.Color.HexStringToColor(backgroundColor).color
  );
}
