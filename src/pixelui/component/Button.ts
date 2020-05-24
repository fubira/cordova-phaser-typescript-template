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
   * Button hover color
   * @default PixelUI.theme.lightAccentColor
   */
  hoverColor?: string;
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
  private button: Phaser.GameObjects.Container;
  private shadow: Phaser.GameObjects.Rectangle;
  private border: Phaser.GameObjects.Rectangle;

  private borderColor: Phaser.Display.Color;
  private hoverColor: Phaser.Display.Color;
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
    const hoverColor = Phaser.Display.Color.ValueToColor(
      style.hoverColor || PixelUI.theme.styles.colorLightAccent
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

    const button = scene.add.container(0, 0, [base, edge, border, textLabel]);
    /* generate container */
    super(scene, x + width / 2, y + height / 2, [shadow, button]);

    this.base = base;
    this.shadow = shadow;
    this.button = button;
    this.border = border;
    this.borderColor = borderColor;
    this.hoverColor = hoverColor;
    this.onClick = onClick;
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
      this.base.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.actionPress();
        this.onClick(pointer);
      });
      this.base.on("pointerover", () => {
        this.border.strokeColor = this.hoverColor.color;
      });
      this.base.on("pointerout", () => {
        this.border.strokeColor = this.borderColor.color;
      });
    } else {
      this.base.setInteractive({ useHandCursor: false });
      this.base.off("pointerdown");
      this.base.off("pointerover");
      this.base.off("pointerout");
    }
    return this;
  }

  private actionPress(): void {
    this.scene.tweens.add({
      targets: this.button,
      ease: Phaser.Math.Easing.Quartic.Out,
      y: { from: 0, to: 4 },
      duration: 100,
      yoyo: true,
    });
    this.scene.tweens.add({
      targets: this.shadow,
      ease: Phaser.Math.Easing.Quartic.Out,
      x: { from: 3, to: 0 },
      duration: 100,
      yoyo: true,
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
