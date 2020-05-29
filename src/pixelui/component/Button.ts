import * as PixelUI from "..";
import * as Utils from "../Utils";
import { TextLabelFactory } from "./TextLabel";
import { ComponentBase, ComponentBaseStyle } from "../ComponentBase";

export interface ButtonStyle extends ComponentBaseStyle {
  /**
   * Button text color
   * @default PixelUI.theme.textColor
   */
  color?: string;

  /**
   * Text size
   * @default "normal"
   */
  textSize?: PixelUI.TextSize;

  /**
   * Button alignment
   * @default "center"
   */
  align?: string;
}

export class Button extends ComponentBase {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: Function,
    style?: PixelUI.ButtonStyle
  ) {
    const textColor = Phaser.Display.Color.ValueToColor(
      style.color || PixelUI.theme.textColor()
    );
    const strokeColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.textStrokeColor()
    );
    const strokeThickness = 6;
    const textSize = style.textSize || "normal";
    let align = 0.5;

    if (style.align === "left") {
      align = 0.0;
    } else if (style.align === "right") {
      align = 1.0;
    }

    /* define label styles */
    const labelStyle: PixelUI.TextLabelStyle = {
      noShadow: true,
      padding: { x: 0, y: 12 },
      align: "center",
      textSize,
      color: textColor.rgba,
      stroke: strokeColor.rgba,
      strokeThickness,
    };

    const textRect = Utils.calcTextRect(scene, text, labelStyle);
    const width = style.fixedWidth || Math.max(textRect.width + 16, 180);
    const height = style.fixedHeight || textRect.height + 8;

    /* add text label */
    const textLabel = TextLabelFactory(scene, 0, 4, text, {
      ...labelStyle,
      fixedWidth: width,
      fixedHeight: height,
    });
    textLabel.setOrigin(align);

    /* generate container */
    super(scene, x, y, [textLabel], {
      onClick: (pointer: Phaser.Input.Pointer) => {
        onClick(pointer);
      },
      fixedWidth: width,
      fixedHeight: height,
      pressDownOnClick: true,
      highlightOnHover: true,
    });

    this.setActive(true);
    this.enable();
  }
}

export function ButtonFactory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  onclick: Function,
  style?: PixelUI.ButtonStyle
): PixelUI.Button {
  const button = new Button(scene, x, y, text, onclick, style || {});
  scene.children.add(button);
  return button;
}
