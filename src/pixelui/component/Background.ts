import { PixelUI } from "..";

export function BackgroundFactory(
  scene: Phaser.Scene,
  color?: string
): Phaser.GameObjects.Rectangle {
  const backgroundColor = color || PixelUI.theme.backgroundColor();
  scene.cameras.main.setBackgroundColor(backgroundColor);

  return scene.add.rectangle(
    0,
    0,
    GAME_WIDTH,
    GAME_HEIGHT,
    Phaser.Display.Color.HexStringToColor(backgroundColor).color
  );
}
