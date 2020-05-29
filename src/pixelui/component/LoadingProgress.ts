/**
 * PixelUI.LoadingProgress
 *
 * A component that hooks up the Phaser to load an asset and displays the progress.
 */
export class LoadingProgress extends Phaser.GameObjects.Container {
  private spriteBar: Phaser.GameObjects.Sprite;
  private spriteFrame: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    spriteBar: string | Phaser.GameObjects.Sprite,
    spriteFrame: string | Phaser.GameObjects.Sprite,
    x?: number,
    y?: number
  ) {
    super(scene, x, y);

    if (spriteBar instanceof Phaser.GameObjects.Sprite) {
      this.spriteBar = spriteBar;
    } else {
      this.spriteBar = new Phaser.GameObjects.Sprite(scene, 0, 0, spriteBar);
    }

    if (spriteFrame instanceof Phaser.GameObjects.Sprite) {
      this.spriteFrame = spriteFrame;
    } else {
      this.spriteFrame = new Phaser.GameObjects.Sprite(
        scene,
        0,
        0,
        spriteFrame
      );
    }

    this.spriteBar.setOrigin(0, 0.5);
    this.spriteBar.x -= this.spriteBar.width * 0.5;
    this.spriteFrame.setOrigin(0.5);

    this.add([this.spriteBar, this.spriteFrame]);
  }

  /**
   * Start loading assets and displaying progress.
   * Promise returns resolve when loading is complete.
   *
   * @param load Callback function for loading assets
   */
  public start(load: Function): Promise<void> {
    this.spriteBar.setScale(0, 1.0);

    return new Promise((resolve, reject) => {
      let tween: Phaser.Tweens.Tween;
      this.scene.load.on("progress", (value: number) => {
        if (tween) {
          this.scene.tweens.remove(tween);
        }
        tween = this.scene.tweens.add({
          targets: [this.spriteBar],
          scaleX: value,
          scaleY: 1,
          duration: 100,
        });
      });

      this.scene.load.on("complete", () => {
        setTimeout(() => {
          resolve();
        }, 250);
      });

      load();

      if (!this.scene.load.isLoading()) {
        reject("no loading files found");
      }
    });
  }
}

/**
 * A component that hooks up the Phaser to load an asset and displays
 * the progress.
 *
 * @param scene Phaser.Scene
 * @param textureBar Progress bar texture image
 * @param textureFrame Progress bar frame image
 */
export function LoadingProgressFactory(
  scene: Phaser.Scene,
  textureBar: string,
  textureFrame: string
): LoadingProgress {
  const progress = new LoadingProgress(
    scene,
    textureBar,
    textureFrame,
    scene.cameras.main.centerX,
    scene.cameras.main.centerY
  );
  scene.children.add(progress);
  return progress;
}
