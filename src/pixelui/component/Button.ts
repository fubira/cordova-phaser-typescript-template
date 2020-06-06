import * as PixelUI from "..";
import logger from "@/logger";

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
    onClick: (pointer: Phaser.Input.Pointer) => Promise<void>,
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

    /* add text label */
    const textLabel = TextLabelFactory(scene, 0, 8, text, {
      ...labelStyle,
      align: "center",
    });
    textLabel.setOrigin(align);

    const width = style.fixedWidth || Math.max(textLabel.width + 16, 180);
    const height = style.fixedHeight || textLabel.height + 8;
    textLabel.setFixedSize(width, height);

    /* generate container */
    super(scene, x, y, [textLabel], {
      onClick: async (pointer: Phaser.Input.Pointer) => {
        if (this.state === "click") {
          logger.warn("[PixelUI] Detecting multiple clicks");
          return;
        }

        this.state = "click";
        await this.actionDown();
        await onClick(pointer);
        await this.actionUp();
        this.state = "ready";
      },
      ...style,
      fixedWidth: width,
      fixedHeight: height,
      highlightOnHover: true,
    });

    this.state = "ready";
    this.setSize(width, height);
    this.setActive(true);
    this.enableAction();
  }
}

export function ButtonFactory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  onclick: (pointer: Phaser.Input.Pointer) => Promise<void>,
  style?: PixelUI.ButtonStyle
): PixelUI.Button {
  const button = new Button(scene, x, y, text, onclick, style || {});
  scene.children.add(button);
  return button;
}
