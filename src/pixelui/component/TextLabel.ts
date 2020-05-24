import * as PixelUI from "../";

export interface TextLabelStyle
  extends Phaser.Types.GameObjects.Text.TextStyle {
  textSize?: PixelUI.TextSize;
  noStroke?: boolean;
  noShadow?: boolean;
}

export class TextLabel extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | string[],
    style: PixelUI.TextLabelStyle = {}
  ) {
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

    if (!style.noStroke) {
      if (!style.stroke && theme.textStroke) {
        style.stroke = "#000000";
        style.strokeThickness = textSize / 8;
      }
    }

    if (!style.noShadow) {
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
    }

    if (!style.fontSize) {
      style.fontSize = `${textSize}px`;
    }

    super(scene, x, y, text, style as Phaser.Types.GameObjects.Text.TextStyle);
  }
}

/**
 * Create a text display component with a common style by theme.
 *
 * @param scene Phaser.Scene
 * @param x Position x
 * @param y Position y
 * @param text Text string[s]
 * @param style Specifying a style
 */
export function TextLabelFactory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string | string[],
  style?: PixelUI.TextLabelStyle
): Phaser.GameObjects.Text {
  const label = new TextLabel(scene, x, y, text, style || {});
  scene.children.add(label);
  return label;
}
