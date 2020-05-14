export class LoadingProgress extends Phaser.GameObjects.Container {
  private spriteBar: Phaser.GameObjects.Sprite;
  private spriteFrame: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    textureBar: string,
    textureFrame: string,
    x?: number,
    y?: number
  ) {
    super(scene, x, y);

    this.spriteBar = new Phaser.GameObjects.Sprite(scene, 0, 0, textureBar);
    this.spriteFrame = new Phaser.GameObjects.Sprite(scene, 0, 0, textureFrame);

    this.spriteBar.setOrigin(0, 0.5);
    this.spriteBar.x -= this.spriteBar.width * 0.5;
    this.spriteFrame.setOrigin(0.5);

    this.add([this.spriteBar, this.spriteFrame]);
  }

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
