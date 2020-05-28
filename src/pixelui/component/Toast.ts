import * as PixelUI from "..";
import * as Utils from "../Utils";
import { TextLabelFactory } from "./TextLabel";
import { ComponentBase, ComponentBaseStyle } from "../ComponentBase";

export interface ToastStyle extends ComponentBaseStyle {
  /**
   * Display position of the toast.
   * @default "top"
   */
  verticalAlign?: "top" | "middle" | "bottom";

  /**
   * Display position of the toast.
   * @default "information"
   */
  type?: "information" | "success" | "warning" | "error";

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

class ToastController {
  private staticToastList: Toast[] = [];

  private relocateAll(): void {
    let yBase = 0;
    this.staticToastList.forEach((toast: Toast, index: number) => {
      yBase += toast.height + 16;
      toast.relocate(yBase, index);
    });
  }

  public add(toast: Toast): void {
    this.staticToastList.unshift(toast);
    this.relocateAll();
  }

  public remove(toast: Toast): void {
    this.staticToastList = this.staticToastList.filter((t) => t !== toast);
    this.relocateAll();
  }
}
export const staticToastController = new ToastController();

export class Toast extends ComponentBase {
  private duration: number;
  private verticalAlign: "top" | "middle" | "bottom";

  constructor(
    scene: Phaser.Scene,
    title?: string,
    message?: string | string[],
    style?: PixelUI.ToastStyle
  ) {
    const maxWidth = GAME_WIDTH * 0.9;
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
    const borderColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.styles.colorDanger
    ).lighten(50);

    const textSize = style.textSize || "small";
    const textAlign = style.textAlign || "left";
    const strokeThickness = PixelUI.theme.getTextSize(style.textSize) / 8;

    /* define label styles */
    const labelStyle: PixelUI.TextLabelStyle = {
      noShadow: true,
      textSize,
      stroke: strokeColor.rgba,
      strokeThickness,
      align: textAlign,
      fixedWidth: maxWidth,
      wordWrap: { width: maxWidth - 20 },
      padding: { x: 6, y: 6 },
    };

    const headerStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      color: headerColor.rgba,
    };

    const messageStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      color: textColor.rgba,
    };

    /* calc text height */
    let titleHeight = 0;
    if (title) {
      titleHeight = Utils.calcTextRect(scene, title, headerStyle).height;
    }
    let messageHeight = 0;
    if (message) {
      messageHeight = Utils.calcTextRect(scene, message, messageStyle).height;
    }
    const totalHeight = Math.min(titleHeight + messageHeight, maxHeight);

    const fixedWidth = maxWidth;
    const fixedHeight = totalHeight;

    /* add title label */
    const titleLabel = TextLabelFactory(
      scene,
      0,
      -titleHeight / 2,
      title,
      headerStyle
    );
    titleLabel.setOrigin(0.5, 0.5);

    /* add message label */
    const messageLabel = TextLabelFactory(
      scene,
      0,
      titleHeight / 2,
      message,
      messageStyle
    );
    messageLabel.setOrigin(0.5, 0.5);

    /* generate container */
    super(scene, 0, 0, [titleLabel, messageLabel], {
      borderColor: borderColor.rgba,
      fixedWidth,
      fixedHeight,
    });
    this.width = fixedWidth;
    this.height = fixedHeight;
    this.verticalAlign = style.verticalAlign || "top";
    this.relocate();

    /* set duration */
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

    if (style.open !== undefined ? style.open : true) {
      this.open();
      setTimeout(() => {
        this.close();
      }, this.duration);
    } else {
      this.setVisible(false);
    }
  }

  private getAlignedPosition(yBase?: number): { x: number; y: number } {
    const position = {
      x: this.scene.cameras.main.centerX,
      y: yBase ? yBase : 0 + 60,
    };

    switch (this.verticalAlign) {
      case "bottom":
        position.y = this.scene.cameras.main.displayHeight - position.y;
        break;
      case "middle":
        position.y = this.scene.cameras.main.centerY + position.y;
        break;
    }
    return position;
  }

  public relocate(yBase?: number, index?: number): void {
    const position = this.getAlignedPosition(yBase);

    if (!index) {
      this.setPosition(position.x, position.y);
    } else {
      this.scene.tweens.add({
        targets: [this],
        x: { from: this.x, to: position.x },
        y: { from: this.y, to: position.y },
        duration: 100,
      });
    }
  }

  public open(): void {
    staticToastController.add(this);
    super.open();
  }

  public close(): void {
    staticToastController.remove(this);
    super.close();
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
