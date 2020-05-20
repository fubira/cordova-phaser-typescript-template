import * as PixelUI from "..";
import * as Utils from "../Utils";
import { TextLabelFactory } from "./TextLabel";

export interface ButtonStyle {
  /**
   * Button text color
   * @default PixelUI.theme.textColor
   */
  color?: string;
  /**
   * Button fill color
   * @default PixelUI.theme.backgroundColor
   */
  fillColor?: string;
  /**
   * Buttonborder color
   * @default PixelUI.theme.textColor
   */
  borderColor?: string;

  /**
   * Text size
   * @default "normal"
   */
  textSize?: PixelUI.TextSize;

  /**
   * Button width
   */
  fixedWidth?: number;

  /**
   * Button height
   */
  fixedHeight?: number;
}

export class Button extends Phaser.GameObjects.Container {
  private rect: Phaser.GameObjects.Rectangle;
  private onClick: Function;

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

    const fillColor = Phaser.Display.Color.ValueToColor(
      style.fillColor || PixelUI.theme.backgroundColor()
    );
    const borderColor = Phaser.Display.Color.ValueToColor(
      style.borderColor || textColor.color
    );
    const shadowColor = Phaser.Display.Color.ValueToColor("#000");
    const edgeColor = borderColor.clone().darken(80);

    const textSize = style.textSize || "normal";
    /* define label styles */
    const labelStyle: PixelUI.TextLabelStyle = {
      noShadow: true,
      fixedWidth: style.fixedWidth,
      padding: { x: 0, y: 12 },
      align: "center",
      textSize,
      color: textColor.rgba,
      stroke: strokeColor.rgba,
      strokeThickness,
    };

    const width = style.fixedWidth;
    const height =
      style.fixedHeight || Utils.calcTextHeight(scene, text, labelStyle);

    /* add shadow gameobject */
    const shadow = scene.add.rectangle(3, 3, width + 6, height + 6);
    shadow.setFillStyle(shadowColor.color, 0.3);

    /* add background rect gameobject */
    const rect = scene.add.rectangle(0, 0, width, height);
    rect.setFillStyle(fillColor.color);

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

    this.rect = rect;
    this.onClick = onClick;
    /* set input callback */
    this.rect.setInteractive({ useHandCursor: true });
    this.rect.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.onClick(pointer);
    });
  }

  public setActive(active: boolean): this {
    if (active) {
      this.rect.setInteractive({ useHandCursor: true });
      this.rect.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.onClick(pointer);
      });
    } else {
      this.rect.setInteractive({ useHandCursor: false });
      this.rect.off("pointerdown");
    }
    return this;
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
