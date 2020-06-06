import * as PixelUI from "..";
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
   * Close when toast is clicked.
   */
  closeOnClick?: boolean;
}

class ToastQueue {
  private queue: Toast[] = [];

  private relocateAll(): void {
    let yBase = 0;

    const topToast = this.queue.filter(
      (toast: Toast) => toast.verticalAlign === "top"
    );
    yBase = 0;
    topToast.forEach((toast: Toast, index: number) => {
      toast.relocate(yBase, index);
      yBase += toast.height + 16;
    });

    const middleToast = this.queue.filter(
      (toast: Toast) => toast.verticalAlign === "middle"
    );
    yBase = 0;
    middleToast.forEach((toast: Toast, index: number) => {
      toast.relocate(yBase, index);
      yBase += toast.height + 16;
    });

    const bottomToast = this.queue.filter(
      (toast: Toast) => toast.verticalAlign === "bottom"
    );
    yBase = 0;
    bottomToast.forEach((toast: Toast, index: number) => {
      toast.relocate(yBase, index);
      yBase += toast.height + 16;
    });
  }

  public add(toast: Toast): void {
    this.queue.unshift(toast);
    this.relocateAll();
  }

  public remove(toast: Toast): void {
    this.queue = this.queue.filter((t) => t !== toast);
    this.relocateAll();
  }
}
export const staticToastQueue = new ToastQueue();

export class Toast extends ComponentBase {
  public duration: number;
  public verticalAlign: "top" | "middle" | "bottom";

  constructor(
    scene: Phaser.Scene,
    title?: string,
    message?: string | string[],
    style?: PixelUI.ToastStyle
  ) {
    const maxWidth = GAME_WIDTH * 0.95;
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
      PixelUI.theme.styles.colorLightShade
    ).lighten(50);

    let typeColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.styles.colorMain
    );

    switch (style.type) {
      case "success": {
        typeColor = Phaser.Display.Color.ValueToColor(
          PixelUI.theme.styles.colorSuccess
        );
        break;
      }
      case "error": {
        typeColor = Phaser.Display.Color.ValueToColor(
          PixelUI.theme.styles.colorDanger
        );
        break;
      }
      case "warning": {
        typeColor = Phaser.Display.Color.ValueToColor(
          PixelUI.theme.styles.colorWarning
        );
        break;
      }
    }

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
      padding: { x: 4, y: 4 },
    };

    const headerStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      color: headerColor.rgba,
    };

    const messageStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      color: textColor.rgba,
    };

    /* add type bar rectangle */
    const typeBar = scene.add.rectangle(
      0,
      0,
      16,
      16,
      typeColor.color,
      typeColor.alphaGL
    );
    typeBar.setInteractive({ useHandCursor: false });
    typeBar.setOrigin(0.5, 0.5);

    /* add title label */
    const titleLabel = TextLabelFactory(scene, 0, 0, title, headerStyle);
    titleLabel.setOrigin(0.5, 0.5);

    /* add message label */
    const messageLabel = TextLabelFactory(scene, 0, 0, message, messageStyle);
    messageLabel.setOrigin(0.5, 0.5);

    /* calc text height */
    const titleHeight = title ? titleLabel.height : 0;
    const messageHeight = message ? messageLabel.height : 0;
    const totalHeight = Math.min(titleHeight + messageHeight, maxHeight);

    const fixedWidth = maxWidth;
    const fixedHeight = totalHeight;

    titleLabel.setPosition(20, -titleHeight / 2 + 4);
    messageLabel.setPosition(20, titleHeight / 2 + 4);

    typeBar.setSize(16, fixedHeight);
    typeBar.setPosition(-fixedWidth / 2 + 6, -fixedHeight / 2 + 6);

    /* generate container */
    super(scene, 0, 0, [typeBar, titleLabel, messageLabel], {
      borderColor: borderColor.rgba,
      fixedWidth,
      fixedHeight,
      onClick: async (): Promise<void> => {
        if (style.closeOnClick !== false) {
          await this.close();
        }
      },
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
          if (this.duration === 0) {
            style.closeOnClick = true;
          }
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
      y: yBase ? yBase : 0,
    };

    switch (this.verticalAlign) {
      case "bottom":
        position.y = this.scene.cameras.main.displayHeight - position.y;
        position.y -= this.height / 2;
        break;
      case "middle":
        position.y = this.scene.cameras.main.centerY + position.y;
        position.y += this.height / 2 + 32;
        break;
      default:
        position.y += this.height / 2 + 32;
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

  public open(): Promise<void> {
    staticToastQueue.add(this);
    return super.open();
  }

  public close(): Promise<void> {
    staticToastQueue.remove(this);
    return super.close();
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
