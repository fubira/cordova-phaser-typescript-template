export class LoaderProgress extends Phaser.GameObjects.Container {
  private barSprite: Phaser.GameObjects.Sprite = null;
  private frameSprite: Phaser.GameObjects.Sprite = null;

  constructor(
    scene: Phaser.Scene,
    bar: Phaser.GameObjects.Sprite,
    frame: Phaser.GameObjects.Sprite
  ) {
    super(scene);
    // align x: left, y: center
    bar.setOrigin(0, 0.5);
    bar.x -= bar.width * 0.5;
    this.barSprite = bar;
    this.add(this.barSprite);

    // align x: center, y: center
    frame.setOrigin(0.5);
    this.frameSprite = frame;
    this.add(this.frameSprite);
  }

  public start(load: Function): Promise<void> {
    this.barSprite.setScale(0, 1.0);

    return new Promise((resolve, reject) => {
      let tween: Phaser.Tweens.Tween;
      this.scene.load.on("progress", (value: number) => {
        if (tween) {
          this.scene.tweens.remove(tween);
        }
        tween = this.scene.tweens.add({
          targets: [this.barSprite],
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
