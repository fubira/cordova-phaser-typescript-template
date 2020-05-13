import { PixelUI, ThemeOptions } from "..";

export enum FontSize {
  exsmall,
  small,
  normal,
  large,
  exlarge,
}

function getSize(size: FontSize, theme: ThemeOptions): number {
  if (size === FontSize.exsmall) {
    return theme.textSizeExSmall || 8;
  } else if (size === FontSize.small) {
    return theme.textSizeSmall || getSize(FontSize.exsmall, theme);
  } else if (size === FontSize.normal) {
    return theme.textSizeNormal || getSize(FontSize.small, theme);
  } else if (size === FontSize.large) {
    return theme.textSizeLarge || getSize(FontSize.normal, theme);
  } else if (size === FontSize.exlarge) {
    return theme.textSizeExLarge || getSize(FontSize.large, theme);
  } else {
    return 8;
  }
}

export class Label extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    size: FontSize = FontSize.normal,
    localTheme?: ThemeOptions
  ) {
    super(scene, 0, 0);
    const theme = PixelUI.theme(localTheme);

    const fontColor = theme.textStroke
      ? theme.colorLightShade || "#FFFFFF"
      : theme.colorDarkShade || "#000000";

    const fontFamily: string = theme.textFontFamily;
    const fontSize: number = getSize(size, theme);

    const label = scene.add.text(0, 0, text, {
      font: `${fontSize}px ${fontFamily}`,
    });

    label.setOrigin(0.5, 0.5);
    label.setPosition(x, y);
    label.setFill(fontColor);
    if (theme.textShadow) {
      label.setShadow(5, 5, "rgba(0,0,0,0.3)", 4, true, true);
    }
    if (theme.textStroke) {
      label.setStroke("#000000", 6);
    }
  }
}
