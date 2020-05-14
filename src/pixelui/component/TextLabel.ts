import * as PixelUI from "../";

export function TextLabelFactory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string | string[],
  style: PixelUI.TextLabelStyle = {}
): Phaser.GameObjects.Text {
  const theme = PixelUI.theme.styles;
  const textSize = PixelUI.theme.getTextSize(style.textSize);

  if (!style.color) {
    style.color = theme.textStroke
      ? theme.colorLightShade || "#FFFFFF"
      : theme.colorDarkShade || "#000000";
  }

  if (!style.fontFamily) {
    style.fontFamily = theme.textFontFamily;
  }

  if (!style.stroke && theme.textStroke) {
    style.stroke = "#000000";
    style.strokeThickness = textSize / 8;
  }

  if (!style.shadow && theme.textShadow) {
    style.shadow = {
      offsetX: 4,
      offsetY: 4,
      color: "rgba(0,0,0,0.3)",
      blur: 2,
      stroke: true,
      fill: true,
    };
  }
  style.fontSize = `${textSize}px`;

  const object = scene.add.text(
    x,
    y,
    text,
    style as Phaser.Types.GameObjects.Text.TextStyle
  );
  return object;
}
