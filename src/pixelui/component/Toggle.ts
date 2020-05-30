import * as PixelUI from "..";
import * as Utils from "../Utils";
import logger from "@/logger";

import { TextLabelFactory } from "./TextLabel";
import { ComponentBase, ComponentBaseStyle } from "../ComponentBase";

export interface ToggleButtonStyle extends ComponentBaseStyle {
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

export class ToggleButton extends ComponentBase {
  private toggle: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onToggle: (state: boolean) => Promise<void>,
    toggle?: boolean,
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
    const textLabel = TextLabelFactory(scene, 0, 8, text, {
      ...labelStyle,
      fixedWidth: width,
      fixedHeight: height,
      align: "center",
    });
    textLabel.setOrigin(align);

    /* generate container */
    super(scene, x, y, [textLabel], {
      onClick: async () => {
        if (this.state === "click") {
          logger.warn("[PixelUI] Detecting multiple clicks");
          return;
        }

        this.toggle = !this.toggle;
        if (this.toggle) {
          this.actionDown();
          this.actionLock();
        } else {
          this.actionUp();
          this.actionUnlock();
        }

        this.state = "click";
        await onToggle(this.toggle);
        this.state = "ready";
      },
      ...style,
      fixedWidth: width,
      fixedHeight: height,
      highlightOnHover: true,
    });

    this.state = "ready";
    this.toggle = false;
    this.setSize(width, height);
    this.setActive(true);
    this.enableAction();
  }
}

export function ToggleButtonFactory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  onToggle: (toggle: boolean) => Promise<void>,
  toggle?: boolean,
  style?: PixelUI.ButtonStyle
): PixelUI.ToggleButton {
  const button = new ToggleButton(
    scene,
    x,
    y,
    text,
    onToggle,
    toggle,
    style || {}
  );
  scene.children.add(button);
  return button;
}
