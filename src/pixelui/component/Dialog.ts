import * as PixelUI from "..";
import * as Utils from "../Utils";
import { TextLabelFactory } from "./TextLabel";

export interface DialogStyle {
  /**
   * Open dialog automatically
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

  /**
   * Dialog buttons
   */
  buttons?: {
    /**
     * Display text of the button
     */
    text: string;
    /**
     * The value to be returned when the button is pressed
     */
    value: string;
  }[];

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

    const textColor = PixelUI.theme.textColor();
    const headerColor = PixelUI.theme.textHeaderColor();
    const buttonColor = PixelUI.theme.styles.colorMain;

    const strokeColor = PixelUI.theme.textStrokeColor();
    const backgroundColor = PixelUI.theme.backgroundColor();

    const borderColor = Utils.valueToColor(style.borderColor, textColor);
    const fillColor = Utils.valueToColor(style.fillColor, backgroundColor);
    const shadowColor = Utils.valueToColor(0);
    const edgeColor = borderColor.clone().darken(80);

    const textSize = style.textSize || "normal";
    const textAlign = style.textAlign || "center";
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
      color: headerColor,
      stroke: strokeColor,
      strokeThickness: 6,
    };

    const messageStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      align: textAlign,
      textSize,
      color: textColor,
      stroke: strokeColor,
      strokeThickness: 6,
    };

    const buttonStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      align: textAlign,
      textSize,
      color: buttonColor,
      stroke: strokeColor,
      strokeThickness: 6,
    };

    /* calc dialog height */
    const titleHeight = !title
      ? 0
      : Utils.calcTextHeight(scene, title, headerStyle);
    const messageHeight = Utils.calcTextHeight(scene, message, messageStyle);
    const buttonHeight =
      !style.buttons || style.buttons.length === 0
        ? 0
        : Utils.calcTextHeight(scene, style.buttons[0].text, buttonStyle);
    const totalHeight = titleHeight + messageHeight + buttonHeight;

    const dialogWidth = maxWidth;
    const dialogHeight = totalHeight > maxHeight ? maxHeight : totalHeight;

    /* add shadow gameobject */
    const shadow = scene.add.rectangle(
      0 + 4,
      0 + 4,
      dialogWidth + 4,
      dialogHeight + 4,
      shadowColor.color,
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

    /* add buttons */
    let buttonLabels: Phaser.GameObjects.GameObject[] = [];
    if (style.buttons) {
      const buttonCount = style.buttons.length;
      const buttonWidth = buttonStyle.fixedWidth / buttonCount - 20;
      console.log(buttonCount, buttonWidth);
      buttonLabels = style.buttons.map((button, index) => {
        const label = TextLabelFactory(
          scene,
          rect.getTopLeft().x + (buttonWidth + 20) * index + 10,
          rect.getTopLeft().y + titleHeight + messageHeight,
          button.text,
          { ...buttonStyle, fixedWidth: buttonWidth }
        );
        label.setInteractive();
        label.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
          console.log(pointer);
          pointer.wasCanceled = true;
          if (style.onSelect) {
            style.onSelect(button.value);
          }
          this.close();
        });
        return label;
      });
    }

    /* generate container */
    super(scene, x, y, [
      shadow,
      rect,
      edge,
      border,
      titleLabel,
      messageLabel,
      ...buttonLabels,
    ]);

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

  return dialog;
}
