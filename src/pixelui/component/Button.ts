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
  private base: Phaser.GameObjects.Rectangle;
  private onClick: Function;
  private posY: number;

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
      padding: { x: 0, y: 12 },
      align: "center",
      textSize,
      color: textColor.rgba,
      stroke: strokeColor.rgba,
      strokeThickness,
    };

    const textRect = Utils.calcTextRect(scene, text, labelStyle);
    const width = style.fixedWidth || Math.max(textRect.width, 180);
    const height = style.fixedHeight || textRect.height + 8;

    /* add shadow gameobject */
    const shadow = scene.add.rectangle(3, 3, width + 6, height + 6);
    shadow.setFillStyle(shadowColor.color, 0.3);

    /* add base rectangle gameobject */
    const base = scene.add.rectangle(0, 0, width, height);
    base.setFillStyle(fillColor.color);

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
      base.getTopLeft().x,
      base.getTopLeft().y + 4,
      text,
      { ...labelStyle, fixedWidth: width, fixedHeight: height }
    );
    textLabel.setOrigin(0.0, 0.0);

    /* generate container */
    super(scene, x + width / 2, y + height / 2, [
      shadow,
      base,
      edge,
      border,
      textLabel,
    ]);

    this.base = base;
    this.onClick = onClick;
    this.posY = this.y;
    this.setActive(true);
  }

  /**
   * Activate/Deactivate button
   *
   * @param active
   */
  public setActive(active: boolean): this {
    if (active) {
      this.base.setInteractive({ useHandCursor: true });
      this.base.on("pointerdown", () => {
        this.actionDrop();
      });
      this.base.on("pointerup", (pointer: Phaser.Input.Pointer) => {
        this.actionRise();
        this.onClick(pointer);
      });
    } else {
      this.base.setInteractive({ useHandCursor: false });
      this.base.off("pointerup");
      this.base.off("pointerdown");
    }
    return this;
  }

  private actionDrop(): void {
    this.scene.tweens.add({
      targets: this,
      ease: Phaser.Math.Easing.Cubic.Out,
      y: { from: this.y, to: this.posY + 5 },
      duration: 50,
      yoyo: false,
    });
  }
  private actionRise(): void {
    this.scene.tweens.add({
      targets: this,
      ease: Phaser.Math.Easing.Cubic.Out,
      y: { from: this.y, to: this.posY },
      duration: 50,
      yoyo: false,
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
