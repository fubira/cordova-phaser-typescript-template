import * as PixelUI from "..";
import logger from "@/logger";

import { TextLabelFactory } from "./TextLabel";
import { ButtonFactory } from "./Button";
import { BackdropFactory } from "./Backdrop";
import { ComponentBase, ComponentBaseStyle } from "../ComponentBase";

export interface DialogStyle extends ComponentBaseStyle {
  /**
   * If true, dialog will open automatically.
   * @default true
   */
  open?: boolean;

  /**
   * If true, dialog will be closed when the backdrop is clicked.
   * @default false
   */
  backdropClose?: boolean;

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
     * The value to be returned when the button is selected.
     */
    value: number | string;
  }[];

  /**
   * Event handler for button selection
   */
  onSelect?: (value: number | string) => void;
}

export class Dialog extends Phaser.GameObjects.Container {
  private dialog: ComponentBase;
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
    const backdropColor = Phaser.Display.Color.ValueToColor(
      PixelUI.theme.backdropColor()
    );

    const textSize = style.textSize || "normal";
    const textAlign = style.textAlign || "center";
    const strokeThickness = 6;

    /* define label styles */
    const labelStyle: PixelUI.TextLabelStyle = {
      noShadow: true,
      align: textAlign,
      fixedWidth: maxWidth,
      wordWrap: { width: maxWidth - 20 },
      padding: { x: 10, y: 10 },
    };

    const headerStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
      textSize,
      color: headerColor.rgba,
      stroke: strokeColor.rgba,
      strokeThickness,
    };

    const messageStyle: PixelUI.TextLabelStyle = {
      ...labelStyle,
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

    /* add title label */
    const titleLabel = TextLabelFactory(scene, 0, 0, title, headerStyle);
    let titleHeight = 0;
    if (title) {
      titleHeight = titleLabel.height;
    }

    /* add message label */
    const messageLabel = TextLabelFactory(scene, 0, 0, message, messageStyle);
    const messageHeight = messageLabel.height;

    /* calc dialog height */
    const totalHeight = Math.min(titleHeight + messageHeight, maxHeight);

    const dialogWidth = maxWidth;
    const dialogHeight = totalHeight;

    const px = -dialogWidth / 2;
    const py = -dialogHeight / 2;

    titleLabel.setOrigin(0.0, 0.0);
    titleLabel.setPosition(px, py);
    messageLabel.setOrigin(0.0, 0.0);
    messageLabel.setPosition(px, py + titleHeight);

    /* add buttons */
    let buttons: PixelUI.Button[] = [];
    if (style.buttons) {
      const buttonCount = style.buttons.length;
      const buttonMargin = buttonCount === 1 ? maxWidth / 2 : 16;
      const buttonWidth = maxWidth / buttonCount - buttonMargin;

      buttons = style.buttons.map((button, index) => {
        return ButtonFactory(
          scene,
          px + (buttonWidth + buttonMargin) * (index + 0.5),
          py + dialogHeight + 60,
          button.text,
          async () => {
            if (style.onSelect) {
              style.onSelect(button.value);
            }
            await this.close();
          },
          { ...buttonStyle, fixedWidth: buttonWidth }
        );
      });
    }

    /* generate backdrop */
    const backdrop = BackdropFactory(scene, {
      fillColor: backdropColor.rgba,
      onClick: () => {
        if (style.backdropClose && this.state === "open") {
          this.close();
        }
      },
    });

    const buttonHeight = buttons ? buttons[0].height : 0;
    const dialog = new ComponentBase(
      scene,
      0,
      -buttonHeight / 2,
      [titleLabel, messageLabel, ...buttons],
      { fixedWidth: dialogWidth, fixedHeight: dialogHeight }
    );

    super(scene, x, y, [backdrop, dialog]);

    this.dialog = dialog;
    this.backdrop = backdrop;
    this.buttons = buttons;
    this.state = "close";

    if (style.open) {
      this.open();
    } else {
      this.setVisible(false);
      this.setButtonActive(false);
    }
  }

  public async open(): Promise<void> {
    if (this.state === "open") {
      logger.warn("[PixelUI] This dialog is already opened.");
      return;
    }

    this.setVisible(true);

    await this.dialog.open();
    this.setButtonActive(true);

    this.state = "open";
  }

  public async close(): Promise<void> {
    if (this.state === "close") {
      logger.warn("[PixelUI] This dialog is already closed.");
      return;
    }

    this.state = "close";
    this.setButtonActive(false);

    this.backdrop.close();
    await this.dialog.close();

    this.setVisible(false);
  }

  private setButtonActive(active: boolean): void {
    if (this.buttons) {
      for (const button of this.buttons) {
        button.setActive(active);
      }
    }
  }
}

export function DialogFactory(
  scene: Phaser.Scene,
  title: string,
  message: string | string[],
  style?: PixelUI.DialogStyle
): PixelUI.Dialog {
  const centerX = scene.cameras.main.centerX;
  const centerY = scene.cameras.main.centerY;

  const dialog = new Dialog(
    scene,
    centerX,
    centerY,
    title,
    message,
    style || {}
  );

  scene.children.add(dialog);

  return dialog;
}
