import * as PixelUI from "..";
import * as Utils from "../Utils";
import { TextLabelFactory } from "./TextLabel";
import { ButtonFactory } from "./Button";
import { BackdropFactory } from "./Backdrop";

export interface DialogStyle {
  /**
   * Open dialog automatically
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
    value: number | string;
  }[];

  /**
   * Event handler for button selection
   */
  onSelect?: (value: number | string) => void;
}

export class Dialog extends Phaser.GameObjects.Container {
  private container: Phaser.GameObjects.Container;
  private backdrop: PixelUI.Backdrop;
  private buttons: PixelUI.Button[];

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

    const textColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.textColor()
    );
    const headerColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.textHeaderColor()
    );
    const buttonColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.styles.colorMain
    );

    const strokeColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.textStrokeColor()
    );
    const backgroundColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.backgroundColor()
    );
    const backdropColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.backdropColor()
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

    const buttonStyle: PixelUI.ButtonStyle = {
      ...labelStyle,
      fillColor: buttonColor.rgba,
      textSize,
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

    /* add buttons */
    let buttons: PixelUI.Button[] = [];
    if (style.buttons) {
      const buttonCount = style.buttons.length;
      const margin = buttonCount === 1 ? maxWidth / 2 : 20;
      const buttonWidth = maxWidth / buttonCount - margin;

      buttons = style.buttons.map((button, index) => {
        return ButtonFactory(
          scene,
          rect.getTopLeft().x + (buttonWidth + 20) * index + margin / 2,
          rect.getTopLeft().y + totalHeight + 20,
          button.text,
          () => {
            if (style.onSelect) {
              style.onSelect(button.value);
            }
            this.close();
          },
          { ...buttonStyle, fixedWidth: buttonWidth }
        );
      });
    }

    /* generate container */
    const container = scene.add.container(x, y, [
      shadow,
      rect,
      edge,
      border,
      titleLabel,
      messageLabel,
      ...buttons,
    ]);

    const backdrop = BackdropFactory(scene, {
      fillColor: backdropColor.rgba,
    });

    super(scene, 0, 0, [backdrop, container]);

    this.buttons = buttons;
    this.container = container;
    this.backdrop = backdrop;

    if (style.open) {
      this.open();
    } else {
      this.setVisible(false);
      this.setButtonActive(false);
    }
  }

  private setButtonActive(active: boolean): void {
    if (this.buttons) {
      for (const button of this.buttons) {
        button.setActive(active);
      }
    }
  }

  /**
   * Open a dialog with a tween animation
   */
  public open(): void {
    this.setVisible(true);
    this.setButtonActive(true);
    this.scene.tweens.add({
      targets: [this.container, this.backdrop],
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
    this.setButtonActive(false);
    this.scene.tweens.add({
      targets: [this.container, this.backdrop],
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
