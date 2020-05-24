import * as PixelUI from "..";
import * as Utils from "../Utils";
import { TextLabelFactory } from "./TextLabel";

export interface ToastStyle {
  /**
   * Display position of the toast.
   * @default "top"
   */
  position?: "top" | "middle" | "bottom";

  /**
   * Duration to display the toast.
   * @default "normal"
   */
  duration?: number | "short" | "normal" | "long";

  /**
   * If true, dialog will open automatically.
   * @default true
   */
  open?: boolean;

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

  /**
   * Text align
   * @default "center"
   */
  textAlign?: string;
}

export class Toast extends Phaser.GameObjects.Container {
  private container: Phaser.GameObjects.Container;
  private duration: number;
  private tween: Phaser.Tweens.Tween;

  constructor(
    scene: Phaser.Scene,
    title?: string,
    message?: string | string[],
    style?: PixelUI.ToastStyle
  ) {
    const maxWidth = GAME_WIDTH * 0.8;
    const maxHeight = GAME_HEIGHT * 0.8;

    const textColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.textColor()
    );
    const headerColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.textHeaderColor()
    );

    const strokeColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.textStrokeColor()
    );
    const backgroundColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.backgroundColor()
    );

    const borderColor = Phaser.Display.Color.ValueToColor(
      style.borderColor || textColor.color
    );
    const fillColor = Phaser.Display.Color.ValueToColor(
      style.fillColor || backgroundColor.color
    );
    const shadowColor = Phaser.Display.Color.ValueToColor(0);
    const edgeColor = borderColor.clone().darken(80);

    const textSize = style.textSize || "normal";
    const textAlign = style.textAlign || "center";
    const strokeThickness = 6;

    /* define label styles */
    const labelStyle: PixelUI.TextLabelStyle = {
      noShadow: true,
      fixedWidth: maxWidth,
      wordWrap: { width: maxWidth - 20 },
      padding: { x: 10, y: 10 },
    };

    const headerStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      align: textAlign,
      textSize,
      color: headerColor.rgba,
      stroke: strokeColor.rgba,
      strokeThickness,
    };

    const messageStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      align: textAlign,
      textSize,
      color: textColor.rgba,
      stroke: strokeColor.rgba,
      strokeThickness,
    };

    /* calc dialog height */
    let titleHeight = 0;
    if (title) {
      titleHeight = Utils.calcTextRect(scene, title, headerStyle).height;
    }
    let messageHeight = 0;
    if (message) {
      messageHeight = Utils.calcTextRect(scene, message, messageStyle).height;
    }
    const totalHeight = Math.min(titleHeight + messageHeight, maxHeight);

    const dialogWidth = maxWidth;
    const dialogHeight = totalHeight;

    /* add shadow gameobject */
    const shadow = scene.add.rectangle(3, 3, dialogWidth + 6, dialogHeight + 6);
    shadow.setFillStyle(shadowColor.color, 0.3);

    /* add background rect gameobject */
    const rect = scene.add.rectangle(0, 0, dialogWidth, dialogHeight);
    rect.setFillStyle(fillColor.color, 0.5);
    rect.setInteractive({ useHandCursor: false }); // hooking a click event in rect

    /* add dialog border and edge */
    const edge = scene.add.rectangle(-2, -2, dialogWidth + 2, dialogHeight + 2);
    edge.setStrokeStyle(6, edgeColor.color, edgeColor.alphaGL || 1);
    edge.setFillStyle();

    const border = scene.add.rectangle(
      -2,
      -2,
      dialogWidth + 2,
      dialogHeight + 2
    );
    border.setStrokeStyle(3, borderColor.color, borderColor.alphaGL || 1);
    border.setFillStyle();

    /* add title label */
    const titleLabel = TextLabelFactory(
      scene,
      rect.getTopLeft().x,
      rect.getTopLeft().y,
      title,
      headerStyle
    );
    titleLabel.setOrigin(0.0, 0.0);

    /* add message label */
    const messageLabel = TextLabelFactory(
      scene,
      rect.getTopLeft().x,
      rect.getTopLeft().y + titleHeight,
      message,
      messageStyle
    );
    messageLabel.setOrigin(0.0, 0.0);

    /* generate container */
    const container = scene.add.container(scene.cameras.main.centerX, 60, [
      shadow,
      rect,
      edge,
      border,
      titleLabel,
      messageLabel,
    ]);

    super(scene, 0, 0, [container]);
    this.container = container;
    this.duration = 2000;
    if (style.duration) {
      switch (style.duration) {
        case "long":
          this.duration = 3000;
          break;
        case "normal":
          this.duration = 2000;
          break;
        case "short":
          this.duration = 1000;
          break;
        default:
          this.duration = Number(style.duration).valueOf();
          break;
      }
    }

    if (style.open) {
      this.open();
    } else {
      this.setVisible(false);
    }
  }

  /**
   * Open a dialog with a tween animation
   */
  public open(): void {
    this.setVisible(true);

    if (this.tween && this.tween.isPlaying()) {
      return;
    }

    this.tween = this.scene.tweens.add({
      targets: [this.container],
      alpha: { from: 0, to: 1 },
      scaleY: { from: 0.6, to: 1 },
      ease: Phaser.Math.Easing.Cubic.Out,
      duration: 100,
    });
    setTimeout(() => {
      this.close();
    }, this.duration);
  }

  /**
   * Close dialog with a tween animation
   */
  public close(): void {
    if (this.tween && this.tween.isPlaying()) {
      return;
    }

    this.tween = this.scene.tweens.add({
      targets: [this.container],
      alpha: { from: 1, to: 0 },
      scaleY: { from: 1, to: 1.035 },
      scaleX: { from: 1, to: 1.035 },
      ease: Phaser.Math.Easing.Cubic.Out,
      delay: 80,
      duration: 200,
      onComplete: () => {
        this.scene.children.remove(this);
      },
    });
  }
}

export function ToastFactory(
  scene: Phaser.Scene,
  title: string,
  message: string | string[],
  style?: PixelUI.ToastStyle
): PixelUI.Toast {
  const toast = new Toast(scene, title, message, style || {});

  scene.children.add(toast);

  return toast;
}
