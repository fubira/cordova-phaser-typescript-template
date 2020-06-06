import * as PixelUI from "..";
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
  private value: boolean;
  private onToggle: (value: boolean) => Promise<void>;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onToggle: (value: boolean) => Promise<void>,
    defaultValue?: boolean,
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

    // const textRect = Utils.calcTextRect(scene, text, labelStyle);

    /* add text label */
    const textLabel = TextLabelFactory(scene, 0, 8, text, {
      ...labelStyle,
      align: "center",
    });
    textLabel.setOrigin(align);

    const width = style.fixedWidth || Math.max(textLabel.width + 16, 180);
    const height = style.fixedHeight || textLabel.height + 8;
    textLabel.setFixedSize(width, height);

    /* Event handler when a component is clicked */
    const onClickHandler = async (): Promise<void> => {
      if (this.state === "click") {
        logger.warn("[PixelUI] Detecting multiple clicks");
        return;
      }
      this.state = "click";
      await this.doToggle();
      this.state = "ready";
    };

    /* generate container */
    super(scene, x, y, [textLabel], {
      onClick: onClickHandler,
      ...style,
      fixedWidth: width,
      fixedHeight: height,
      highlightOnHover: true,
    });

    this.state = "ready";
    this.setSize(width, height);
    this.setActive(true);
    this.enableAction();
    this.onToggle = onToggle;
    this.doToggle(defaultValue);
  }

  /**
   * Toggle the value and take action accordingly.
   * @param value forced value
   */
  public async doToggle(value?: boolean): Promise<void> {
    if (value !== undefined) {
      this.value = value;
    } else {
      this.value = !this.value;
    }

    if (this.value) {
      this.actionDown();
      this.actionLock();
    } else {
      this.actionUp();
      this.actionUnlock();
    }

    await this.onToggle(this.value);
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
