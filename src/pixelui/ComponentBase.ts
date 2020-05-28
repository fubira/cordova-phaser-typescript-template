import * as PixelUI from ".";

export interface ComponentBaseStyle {
  /**
   * Component fill color
   * @default PixelUI.theme.backgroundColor
   */
  fillColor?: string;
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
   * Component alignment
   * @default "center"
   */
  align?: string;

  /**
   * Event handler for button selection
   */
  onClick?: (value: number | string) => void;

  onHover?: (start: boolean) => void;

  onOpen?: () => void;

  onClose?: () => void;
}

export class ComponentBase extends Phaser.GameObjects.Container {
  private fill: Phaser.GameObjects.Rectangle;
  private shadow: Phaser.GameObjects.Rectangle;
  private borderMain: Phaser.GameObjects.Rectangle;
  private borderEdge: Phaser.GameObjects.Rectangle;

  private borderMainColor: Phaser.Display.Color;
  private borderHoverColor: Phaser.Display.Color;
  private borderActiveColor: Phaser.Display.Color;
  private onClick: Function;
  private onHover: Function;
  private onOpen: Function;
  private onClose: Function;

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
    ).darken(5);
    const borderMainColor = Phaser.Display.Color.ValueToColor(
      style.borderColor || PixelUI.theme.textColor()
    );
    const borderEdgeColor = Phaser.Display.Color.ValueToColor(
      style.borderEdgeColor || borderMainColor.clone().darken(50).rgba
    );
    const borderHoverColor = Phaser.Display.Color.ValueToColor(
      style.borderHoverColor || borderMainColor.clone().lighten(50).rgba
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
      width + 6,
      height + 6,
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
    const borderEdge = scene.add.rectangle(0, 0, width + 4, height + 4);
    borderEdge.setStrokeStyle(
      2,
      borderEdgeColor.color,
      borderEdgeColor.alphaGL || 1.0
    );
    borderEdge.setOrigin(align);

    const borderMain = scene.add.rectangle(0, 0, width, height);
    borderMain.setStrokeStyle(
      3,
      borderMainColor.color,
      borderMainColor.alphaGL || 1.0
    );
    borderMain.setFillStyle();
    borderMain.setOrigin(align);

    const base = scene.add.container(0, 0, [
      fill,
      borderEdge,
      borderMain,
      scene.add.container(4, 4, children),
    ]);

    /* generate container */
    super(scene, x, y, [shadow, base]);

    this.fill = fill;
    this.shadow = shadow;
    this.borderMain = borderMain;
    this.borderEdge = borderEdge;
    this.borderMainColor = borderMainColor;
    this.borderHoverColor = borderHoverColor;

    this.onClick = style.onClick;
    this.onHover = style.onHover;
    this.onOpen = style.onOpen;
    this.onClose = style.onClose;

    this.setActive(true);
  }

  /**
   * Enabling a component
   */
  public enable(): this {
    this.fill.setInteractive({ useHandCursor: true });
    this.fill.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.onClick(pointer);
    });
    this.fill.on("pointerover", () => {
      this.borderMain.strokeColor = this.borderHoverColor.color;
      this.onHover(true);
    });
    this.fill.on("pointerout", () => {
      this.borderMain.strokeColor = this.borderMainColor.color;
      this.onHover(false);
    });
    return this;
  }

  /**
   * Disabling a component
   */
  public disable(): this {
    this.fill.setInteractive({ useHandCursor: false });
    this.fill.off("pointerdown");
    this.fill.off("pointerover");
    this.fill.off("pointerout");
    return this;
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
      targets: [this],
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
      },
    });
  }
}
