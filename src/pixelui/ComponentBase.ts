import * as PixelUI from ".";

export interface ComponentBaseStyle {
  /**
   * Component fill color
   * @default PixelUI.theme.backgroundColor
   */
  fillColor?: string;
  /**
   * Component fill lock color
   * @default PixelUI.theme.colorMain
   */
  fillLockColor?: string;
  /**
   * Component border color
   * @default PixelUI.theme.textColor
   */
  borderColor?: string;
  /**
   * Component hover color
   * @default PixelUI.theme.lightAccentColor
   */
  borderHoverColor?: string;
  /**
   * Component hover color
   * @default PixelUI.theme.lightAccentColor
   */
  borderEdgeColor?: string;

  /**
   * Component width
   */
  fixedWidth?: number;
  /**
   * Component height
   */
  fixedHeight?: number;

  /**
   * Highlight when the cursor is on a component
   * @default false
   */
  highlightOnHover?: boolean;

  /**
   * Component alignment
   * @default "center"
   */
  align?: string;

  /**
   * Event handler
   */
  onClick?: (position: Phaser.Input.Pointer) => Promise<void>;

  onHover?: (start: boolean) => Promise<void>;

  onOpen?: () => Promise<void>;

  onClose?: () => Promise<void>;
}

export class ComponentBase extends Phaser.GameObjects.Container {
  private fill: Phaser.GameObjects.Rectangle;
  public base: Phaser.GameObjects.Container;
  public shadow: Phaser.GameObjects.Rectangle;
  private borderMain: Phaser.GameObjects.Rectangle;

  private style: ComponentBaseStyle;

  private fillColor: Phaser.Display.Color;
  private fillLockColor: Phaser.Display.Color;
  private borderMainColor: Phaser.Display.Color;
  private borderHoverColor: Phaser.Display.Color;

  private tween: Phaser.Tweens.Tween;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    children: Phaser.GameObjects.GameObject[],
    style?: ComponentBaseStyle
  ) {
    /* Colors */
    const fillColor = Phaser.Display.Color.ValueToColor(
      style.fillColor || PixelUI.theme.backgroundColor()
    );
    const fillLockColor = Phaser.Display.Color.ValueToColor(
      style.fillLockColor || PixelUI.theme.styles.colorMain
    );
    const borderMainColor = Phaser.Display.Color.ValueToColor(
      style.borderColor || PixelUI.theme.borderColor()
    );
    const borderEdgeColor = Phaser.Display.Color.ValueToColor(
      style.borderEdgeColor || PixelUI.theme.borderEdgeColor()
    );
    const borderHoverColor = Phaser.Display.Color.ValueToColor(
      style.borderHoverColor || PixelUI.theme.borderHoverColor()
    );
    const shadowColor = Phaser.Display.Color.ValueToColor("#000");
    const shadowAlpha = 0.3;

    /* Align */
    let align = 0.5;
    switch (style.align) {
      case "right":
        align = 1.0;
      case "left":
        align = 0.0;
      default:
    }

    /* Size */
    const width = style.fixedWidth;
    const height = style.fixedHeight;

    /* Shadow */
    const shadow = scene.add.rectangle(
      4,
      4,
      width + 8,
      height + 8,
      shadowColor.color,
      shadowAlpha
    );
    shadow.setOrigin(align);

    /* Base rectangle */
    const fill = scene.add.rectangle(
      0,
      0,
      width,
      height,
      fillColor.color,
      fillColor.alphaGL
    );
    fill.setInteractive({ useHandCursor: false });
    fill.setOrigin(align);

    /* add dialog border and edge */
    const borderEdge = scene.add.rectangle(0, 0, width + 6, height + 6);
    borderEdge.setStrokeStyle(
      4,
      borderEdgeColor.color,
      borderEdgeColor.alphaGL || 1.0
    );
    borderEdge.setOrigin(align);

    const borderMain = scene.add.rectangle(0, 0, width, height);
    borderMain.setStrokeStyle(
      4,
      borderMainColor.color,
      borderMainColor.alphaGL || 1.0
    );
    borderMain.setFillStyle();
    borderMain.setOrigin(align);

    const base = scene.add.container(0, 0, [
      fill,
      scene.add.container(0, 0, children),
      borderEdge,
      borderMain,
    ]);

    /* generate container */
    super(scene, x, y, [shadow, base]);

    this.style = style;
    this.fill = fill;
    this.fillColor = fillColor;
    this.fillLockColor = fillLockColor;
    this.base = base;
    this.shadow = shadow;
    this.borderMain = borderMain;
    this.borderMainColor = borderMainColor;
    this.borderHoverColor = borderHoverColor;
    this.setActive(true);
  }

  /**
   * Enabling a component
   */
  public enableAction(): this {
    this.fill.setInteractive({ useHandCursor: true });
    this.fill.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.style.onClick) {
        this.style.onClick(pointer);
      }
    });
    this.fill.on("pointerover", () => {
      if (this.style.highlightOnHover) {
        this.highlight(true);
      }
      if (this.style.onHover) {
        this.style.onHover(true);
      }
    });
    this.fill.on("pointerout", () => {
      if (this.style.highlightOnHover) {
        this.highlight(false);
      }
      if (this.style.onHover) {
        this.style.onHover(false);
      }
    });
    return this;
  }

  /**
   * Disabling a component
   */
  public disableAction(): this {
    this.fill.setInteractive({ useHandCursor: false });
    this.fill.off("pointerdown");
    this.fill.off("pointerover");
    this.fill.off("pointerout");
    return this;
  }

  /**
   * Open a dialog with a tween animation
   */
  public open(): Promise<void> {
    this.setVisible(true);
    this.enableAction();
    return new Promise((resolve) => {
      if (this.tween && this.tween.isPlaying()) {
        return resolve();
      }

      this.tween = this.scene.tweens.add({
        targets: [this],
        alpha: { from: 0, to: 1 },
        scaleY: { from: 0.6, to: 1 },
        ease: Phaser.Math.Easing.Cubic.Out,
        duration: 100,
        onComplete: () => {
          if (this.style.onOpen) {
            this.style.onOpen().then(() => {
              resolve();
            });
          } else {
            resolve();
          }
        },
      });
    });
  }

  /**
   * Close dialog with a tween animation
   */
  public close(): Promise<void> {
    this.disableAction();

    return new Promise((resolve) => {
      if (this.tween && this.tween.isPlaying()) {
        return;
      }

      this.tween = this.scene.tweens.add({
        targets: [this],
        alpha: { from: 1, to: 0 },
        scaleY: { from: 1, to: 1.035 },
        scaleX: { from: 1, to: 1.035 },
        ease: Phaser.Math.Easing.Cubic.Out,
        delay: 80,
        duration: 200,
        onComplete: () => {
          this.scene.children.remove(this);
          if (this.style.onClose) {
            this.style.onClose().then(() => {
              resolve();
            });
          } else {
            resolve();
          }
        },
      });
    });
  }

  public actionLock(): Promise<void> {
    this.fill.fillColor = this.fillLockColor.color;
    return Promise.resolve();
  }
  public actionUnlock(): Promise<void> {
    this.fill.fillColor = this.fillColor.color;
    return Promise.resolve();
  }

  public actionDown(): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.shadow,
        ease: Phaser.Math.Easing.Quartic.Out,
        x: { from: 4, to: 0 },
        duration: 50,
      });
      this.scene.tweens.add({
        targets: this.base,
        ease: Phaser.Math.Easing.Quartic.Out,
        y: { from: 0, to: 4 },
        duration: 50,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  public actionUp(): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.shadow,
        ease: Phaser.Math.Easing.Quartic.Out,
        x: { from: 0, to: 4 },
        duration: 50,
      });
      this.scene.tweens.add({
        targets: this.base,
        ease: Phaser.Math.Easing.Quartic.Out,
        y: { from: 4, to: 0 },
        duration: 50,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  public highlight(hover: boolean): void {
    this.borderMain.strokeColor = hover
      ? this.borderHoverColor.color
      : this.borderMainColor.color;
  }
}
