import * as Assets from "@/assets";
import BgmPlayer from "@/utils/BgmPlayer";
import { Background, Label, FontSize } from "@/pixelui";

export default class TitlScene extends Phaser.Scene {
  private titleText: Phaser.GameObjects.Text = null;
  private subtitleText: Phaser.GameObjects.BitmapText = null;
  private tapToStartText: Phaser.GameObjects.GameObject = null;
  private sfxAudioSprites:
    | Phaser.Sound.WebAudioSound
    | Phaser.Sound.HTML5AudioSound = null;

  public init(): void {
    this.children.add(new Background(this));
  }

  public preload(): void {
    this.sfxAudioSprites = this.sound.addAudioSprite(
      Assets.Audiosprites.AudiospritesSound.getName()
    );
    BgmPlayer.instance.play([
      Assets.Audio.AudioBgm.getMP3(),
      Assets.Audio.AudioBgm.getOGG(),
    ]);
  }

  public create(): void {
    if (window.cordova) {
      SpinnerDialog.hide();
    }

    this.cameras.main.flash(400, 0, 0, 0);
    const spaceKey = this.input.keyboard.addKey("SPACE");

    spaceKey.on("down", () => {
      this.startGame();
    });
    this.input.on("pointerdown", () => {
      this.startGame();
    });

    const posX = this.cameras.main.centerX;
    const posY = this.cameras.main.centerY;

    this.children.add(
      new Label(
        this,
        posX,
        posY - 120,
        "Hello Phaser\nWorld!!\n123456\n345678",
        FontSize.exlarge
      )
    );
    this.children.add(new Label(this, posX, posY, "Secondary Label"));
    this.tapToStartText = this.children.add(
      new Label(this, posX, posY + 80, "Tap to Start", FontSize.small)
    );

    this.tweens.add({
      targets: this.tapToStartText,
      alpha: { from: 0, to: 1 },
      ease: "CubicOut",
      duration: 500,
      repeat: -1,
      yoyo: true,
    });
  }

  private startGame(): void {
    this.sfxAudioSprites.play("se_select");
    this.cameras.main.flash(100);
    this.cameras.main.shake(100, 0.01);
  }
}
