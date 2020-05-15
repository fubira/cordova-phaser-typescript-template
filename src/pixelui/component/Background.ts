import * as PixelUI from "../";

export interface BackgroundStyle {
  fillColor?: string;
  fillAlpha?: number;
  texture?: string;
}

export function BackgroundFactory(
  scene: Phaser.Scene,
  style: BackgroundStyle
): Phaser.GameObjects.Rectangle {
  const backgroundColor = style.fillColor || PixelUI.theme.backgroundColor();
  const texture = style.texture;
  const fillAlpha = style.texture ? style.fillAlpha || 0.5 : 1.0;
  const centerX = scene.cameras.main.centerX;
  const centerY = scene.cameras.main.centerY;

  if (texture) {
    scene.add.sprite(centerX, centerY, texture);
  }

  scene.cameras.main.setBackgroundColor(backgroundColor);

  return scene.add.rectangle(
    centerX,
    centerY,
    GAME_WIDTH,
    GAME_HEIGHT,
    Phaser.Display.Color.HexStringToColor(backgroundColor).color,
    fillAlpha
  );
}