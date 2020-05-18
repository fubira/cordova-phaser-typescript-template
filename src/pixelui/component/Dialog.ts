import * as PixelUI from "..";
import * as Utils from "../Utils";
import { TextLabelFactory } from "./TextLabel";

export interface DialogStyle {
  /**
   * Dialog fill color
   */
  fillColor?: string;
  /**
   * Dialog border color
   */
  borderColor?: string;
  /**
   * Dialog buttons
   */
  buttons?: [
    {
      /**
       * Display text of the button
       */
      text: string;
      /**
       * The value to be returned when the button is pressed
       */
      value: string;
    }
  ];
  /**
   * Event handler for button selection
   */
  onSelect?: (value: string) => void;
}

export class Dialog extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x?: number,
    y?: number,
    title?: string,
    message?: string | string[],
    style?: PixelUI.DialogStyle
  ) {
    const maxWidth = GAME_WIDTH * 0.8;
    const maxHeight = GAME_HEIGHT * 0.8;

    const borderColor = Utils.valueToColor(
      style.borderColor,
      PixelUI.theme.textColor()
    );
    const fillColor = Utils.valueToColor(
      style.fillColor,
      PixelUI.theme.backgroundColor()
    );
    const edgeColor = borderColor.clone().darken(80);

    /* define label styles */
    const labelStyle: PixelUI.TextLabelStyle = {
      noShadow: true,
      align: "center",
      fixedWidth: maxWidth,
      wordWrap: { width: maxWidth - 20 },
      padding: { x: 10, y: 10 },
    };

    const headerStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      textSize: "small",
      color: PixelUI.theme.textHeaderColor(),
      stroke: PixelUI.theme.textStrokeColor(),
      strokeThickness: 6,
    };

    const messageStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      textSize: "small",
      color: PixelUI.theme.textColor(),
      stroke: PixelUI.theme.textStrokeColor(),
      strokeThickness: 6,
    };

    /* calc dialog height */
    const titleHeight = !title
      ? 0
      : Utils.calcTextHeight(scene, title, headerStyle);
    const messageHeight = !message
      ? 0
      : Utils.calcTextHeight(scene, message, messageStyle);
    const buttonHeight =
      !style.buttons || style.buttons.length > 0
        ? 0
        : Utils.calcTextHeight(scene, message, messageStyle);

    const totalHeight = titleHeight + messageHeight + buttonHeight;

    const dialogWidth = maxWidth;
    const dialogHeight = totalHeight > maxHeight ? maxHeight : totalHeight;

    /* add shadow gameobject */
    const shadow = scene.add.rectangle(
      0 + 4,
      0 + 4,
      dialogWidth + 4,
      dialogHeight + 4,
      0,
      0.3
    );

    /* add background rect gameobject */
    const rect = scene.add.rectangle(
      0,
      0,
      dialogWidth,
      dialogHeight,
      fillColor.color,
      0.3
    );

    /* add dialog border and edge */
    const edge = scene.add.rectangle(-1, -1, dialogWidth, dialogHeight);
    edge.setStrokeStyle(6, edgeColor.color, edgeColor.alphaGL || 1);
    edge.setFillStyle();

    const border = scene.add.rectangle(-1, -1, dialogWidth, dialogHeight);
    border.setStrokeStyle(3, borderColor.color, borderColor.alphaGL || 1);
    border.setFillStyle();

    /* add texts */
    const titleLabel = TextLabelFactory(
      scene,
      rect.getTopLeft().x,
      rect.getTopLeft().y,
      title,
      headerStyle
    );
    titleLabel.setOrigin(0.0, 0.0);

    const messageLabel = TextLabelFactory(
      scene,
      rect.getTopLeft().x,
      rect.getTopLeft().y + titleHeight,
      message,
      messageStyle
    );
    messageLabel.setOrigin(0.0, 0.0);

    /* add dialog container */
    super(scene, x, y, [shadow, rect, edge, border, titleLabel, messageLabel]);
  }

  /**
   * Open a dialog with a tween animation
   */
  public open(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 0, to: 1 },
      scaleY: { from: 0.6, to: 1 },
      ease: Phaser.Math.Easing.Cubic.Out,
      duration: 100,
    });
  }

  /**
   * Close dialog with a tween animation
   */
  public close(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0 },
      scaleY: { from: 1, to: 1.035 },
      scaleX: { from: 1, to: 1.035 },
      ease: Phaser.Math.Easing.Cubic.Out,
      duration: 200,
      onComplete: () => {
        this.destroy(true);
      },
    });
  }
}

export function DialogFactory(
  scene: Phaser.Scene,
  title: string,
  message: string | string[],
  style: PixelUI.DialogStyle = {}
): PixelUI.Dialog {
  const centerX = scene.cameras.main.centerX;
  const centerY = scene.cameras.main.centerY;
  const dialog = new Dialog(scene, centerX, centerY, title, message, style);
  scene.children.add(dialog);
  dialog.open();
  return dialog;
}
