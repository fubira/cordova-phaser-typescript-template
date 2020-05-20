import * as PixelUI from "..";

export interface BackdropStyle {
  fillColor?: string;
  /**
   * Event handler for button selection
   */
  onClick?: (value: string) => void;
}

export class Backdrop extends Phaser.GameObjects.Container {
  private wall: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, style: BackdropStyle) {
    const fillColor = Phaser.Display.Color.ValueToColor(
      style.fillColor || "#000"
    );

    /* add shadow gameobject */
    const wall = scene.add.rectangle(0, 0, GAME_WIDTH * 2, GAME_HEIGHT * 2);
    wall.setInteractive({ useHandCursor: false });
    wall.setFillStyle(fillColor.color, 0.3);
    wall.setOrigin(0);

    scene.tweens.add({
      targets: wall,
      alpha: { from: 0, to: 1 },
      duration: 50,
    });
    /* generate container */
    super(scene, 0, 0, [wall]);
    this.wall = wall;
  }

  public close(): void {
    this.scene.tweens.add({
      targets: this.wall,
      alpha: { from: 1, to: 0 },
      duration: 50,
    });
  }
}

export function BackdropFactory(
  scene: Phaser.Scene,
  style: PixelUI.BackdropStyle = {}
): PixelUI.Backdrop {
  return new Backdrop(scene, style);
}