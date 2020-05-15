import * as PixelUI from "..";

export interface DialogStyle {
  fillColor?: string;
  borderColor?: string;
  borderSize?: number;
}

export function DialogFactory(
  scene: Phaser.Scene,
  callback: Function,
  style: DialogStyle = {}
): Phaser.GameObjects.Rectangle {
  const theme = PixelUI.theme.styles;
  const centerX = scene.cameras.main.centerX;
  const centerY = scene.cameras.main.centerY;
  const width = GAME_WIDTH * 0.8;
  const height = GAME_HEIGHT * 0.4;

  const borderColor = Phaser.Display.Color.HexStringToColor(
    style.borderColor || theme.colorLightShade
  );
  const fillColor = Phaser.Display.Color.HexStringToColor(
    style.fillColor || theme.colorLightShade
  );
  const edgeColor = borderColor.clone().darken(80);
  console.log(borderColor, fillColor);

  const shadow = scene.add.rectangle(
    centerX + 6,
    centerY + 6,
    width + 3,
    height + 3,
    0,
    0.3
  );

  const rect = scene.add.rectangle(
    centerX,
    centerY,
    width,
    height,
    fillColor.color,
    0.8
  );

  const edge = scene.add.rectangle(centerX - 1, centerY - 1, width, height);
  edge.setStrokeStyle(6, edgeColor.color, edgeColor.alphaGL || 1);
  edge.setFillStyle();

  const border = scene.add.rectangle(centerX - 1, centerY - 1, width, height);
  border.setStrokeStyle(3, borderColor.color, borderColor.alphaGL || 1);
  border.setFillStyle();

  return rect;
}
