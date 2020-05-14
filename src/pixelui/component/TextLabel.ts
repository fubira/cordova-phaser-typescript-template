import { PixelUI, ThemeStyles } from "..";

function getFontSize(size: string, theme: ThemeStyles): number {
  switch (size) {
    case "xsmall":
      return theme.textSizeXSmall || 12;
    case "small":
      return theme.textSizeSmall || getFontSize("exsmall", theme);
    case "normal":
      return theme.textSizeNormal || getFontSize("small", theme);
    case "large":
      return theme.textSizeLarge || getFontSize("normal", theme);
    case "xlarge":
      return theme.textSizeXLarge || getFontSize("large", theme);
    default:
      return Number.parseInt(size, 10) || 12;
  }
}

export function LabelTextFactory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string | string[],
  size: "xsmall" | "small" | "large" | "normal" | "xlarge" | null,
  style: Phaser.Types.GameObjects.Text.TextStyle = {}
): Phaser.GameObjects.Text {
  const theme = PixelUI.theme.styles;
  const fontSize = getFontSize(size, theme);

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
    style.strokeThickness = fontSize / 8;
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
  style.fontSize = `${fontSize}px`;

  const object = scene.add.text(0, 0, text, style);
  object.setOrigin(0.5, 0.5);
  object.setPosition(x, y);

  return object;
}
