import * as Assets from "@/assets";
import BgmPlayer from "@/utils/BgmPlayer";
import { PixelUI } from "@/pixelui";

export default class TitlScene extends Phaser.Scene {
  private tapToStartText: Phaser.GameObjects.GameObject = null;
  private sfxAudioSprites:
    | Phaser.Sound.WebAudioSound
    | Phaser.Sound.HTML5AudioSound = null;

  public init(): void {
    PixelUI.add.background(this);
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

    PixelUI.add.label(
      this,
      posX,
      posY - 180,
      ["Hello Phaser!", "Multi Line", "日本語メッセージ"],
      "large",
      { color: PixelUI.theme.styles.colorLightAccent, align: "center" }
    );

    PixelUI.add.label(this, posX, posY, "おはようございます", "normal");

    this.tapToStartText = PixelUI.add.label(
      this,
      posX,
      posY + 120,
      "Tap to Start",
      "small"
    );

    this.tweens.add({
      targets: this.tapToStartText,
      alpha: { from: 0, to: 1 },
      ease: "CubicOut",
      duration: 800,
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
