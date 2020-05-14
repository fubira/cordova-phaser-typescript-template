import { PixelUI, ThemeOptions } from "..";

type LabelStyle = {
  align?: string;
  size?: string;
  width?: number;
  height?: number;
  maxLength?: number;
};

function getFontSize(size: string, theme: ThemeOptions): number {
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
  style: LabelStyle = {}
): Phaser.GameObjects.Text {
  const theme = PixelUI.theme.main;
  const color = theme.textStroke
    ? theme.colorLightShade || "#FFFFFF"
    : theme.colorDarkShade || "#000000";

  const fontFamily = theme.textFontFamily;
  const fontSize = getFontSize(style.size, theme);
  const strokeSize = fontSize / 8;

  const object = scene.add.text(0, 0, text, {
    fontFamily: `${fontFamily}`,
    fontSize: `${fontSize}px`,
    color,
    ...style,
  });
  object.setOrigin(0.5, 0.5);
  object.setPosition(x, y);

  if (theme.textShadow) {
    object.setShadow(4, 4, "rgba(0,0,0,0.3)", 2, true, true);
  }
  if (theme.textStroke) {
    object.setStroke("#000000", strokeSize);
  }

  return object;
}
