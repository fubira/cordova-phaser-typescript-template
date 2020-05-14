import { PixelUI, ThemeOptions } from "..";

export enum LabelTextSize {
  exsmall,
  small,
  normal,
  large,
  exlarge,
}

function getSize(size: LabelTextSize, theme: ThemeOptions): number {
  if (size === LabelTextSize.exsmall) {
    return theme.textSizeExSmall || 12;
  } else if (size === LabelTextSize.small) {
    return theme.textSizeSmall || getSize(LabelTextSize.exsmall, theme);
  } else if (size === LabelTextSize.normal) {
    return theme.textSizeNormal || getSize(LabelTextSize.small, theme);
  } else if (size === LabelTextSize.large) {
    return theme.textSizeLarge || getSize(LabelTextSize.normal, theme);
  } else if (size === LabelTextSize.exlarge) {
    return theme.textSizeExLarge || getSize(LabelTextSize.large, theme);
  } else {
    return 12;
  }
}

export function LabelTextFactory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string | string[],
  size: LabelTextSize = LabelTextSize.normal,
  style: Phaser.Types.GameObjects.Text.TextStyle = {}
): Phaser.GameObjects.Text {
  const theme = PixelUI.theme.main;
  const color = theme.textStroke
    ? theme.colorLightShade || "#FFFFFF"
    : theme.colorDarkShade || "#000000";

  const fontFamily = theme.textFontFamily;
  const fontSize = `${getSize(size, theme)}px`;
  const strokeSize = getSize(size, theme) / 8;

  const object = scene.add.text(0, 0, text, {
    fontFamily,
    fontSize,
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
