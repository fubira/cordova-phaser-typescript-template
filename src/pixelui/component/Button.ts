import * as PixelUI from "..";
import * as Utils from "../Utils";
import { TextLabelFactory } from "./TextLabel";

export interface ButtonStyle {
  /**
   * Dialog fill color
   * @default PixelUI.theme.backgroundColor
   */
  fillColor?: string;
  /**
   * Dialog border color
   * @default PixelUI.theme.textColor
   */
  borderColor?: string;

  /**
   * Text size
   * @default "normal"
   */
  textSize?: PixelUI.TextSize;

  fixedWidth?: number;
  fixedHeight?: number;
  /**
   * Event handler for button selection
   */
  onSelect?: (value: string) => void;
}

export class Button extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onclick: Function,
    style?: PixelUI.ButtonStyle
  ) {
    const textColor = PixelUI.theme.textColor();
    const strokeColor = PixelUI.theme.textStrokeColor();
    const backgroundColor = PixelUI.theme.backgroundColor();

    const borderColor = Utils.valueToColor(style.borderColor, textColor);
    const fillColor = Utils.valueToColor(style.fillColor, backgroundColor);
    const shadowColor = Utils.valueToColor(0);
    const edgeColor = borderColor.clone().darken(80);

    const textSize = style.textSize || "normal";
    /* define label styles */
    const labelStyle: PixelUI.TextLabelStyle = {
      noShadow: true,
      fixedWidth: style.fixedWidth,
      padding: { x: 0, y: 12 },
      align: "center",
      textSize,
      color: textColor,
      stroke: strokeColor,
      strokeThickness: 6,
    };

    const width = style.fixedWidth;
    const height =
      style.fixedHeight || Utils.calcTextHeight(scene, text, labelStyle);

    /* add shadow gameobject */
    const shadow = scene.add.rectangle(
      3,
      3,
      width + 6,
      height + 6,
      shadowColor.color,
      0.3
    );

    /* add background rect gameobject */
    const rect = scene.add.rectangle(0, 0, width, height, fillColor.color);

    /* add dialog border and edge */
    const edge = scene.add.rectangle(-2, -2, width + 2, height + 2);
    edge.setStrokeStyle(6, edgeColor.color, edgeColor.alphaGL || 1);
    edge.setFillStyle();

    const border = scene.add.rectangle(-2, -2, width + 2, height + 2);
    border.setStrokeStyle(3, borderColor.color, borderColor.alphaGL || 1);
    border.setFillStyle();

    /* add text label */
    const textLabel = TextLabelFactory(
      scene,
      rect.getTopLeft().x,
      rect.getTopLeft().y + 4,
      text,
      labelStyle
    );
    textLabel.setOrigin(0.0, 0.0);

    /* generate container */
    super(scene, x + width / 2, y + height / 2, [
      shadow,
      rect,
      edge,
      border,
      textLabel,
    ]);

    /* set input callback */
    rect.setInteractive({ useHandCursor: true });
    rect.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      onclick(pointer);
    });
  }
}

export function ButtonFactory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  onclick: Function,
  style: PixelUI.ButtonStyle = {}
): PixelUI.Button {
  const button = new Button(scene, x, y, text, onclick, style);
  scene.children.add(button);

  return button;
}
