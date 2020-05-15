import * as Assets from "@/assets";
import * as PixelUI from "@/pixelui";
import BgmPlayer from "@/utils/BgmPlayer";

export default class TitlScene extends Phaser.Scene {
  private tapToStartText: Phaser.GameObjects.GameObject = null;
  private sfxAudioSprites:
    | Phaser.Sound.WebAudioSound
    | Phaser.Sound.HTML5AudioSound = null;

  public init(): void {
    PixelUI.add.background(this, {
      texture: Assets.Images.ImagesBackground.getName(),
    });
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

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    PixelUI.add.textLabel(
      this,
      0,
      0,
      ["Hello Phaser!", "Multi Line", "日本語メッセージ"],
      {
        textSize: "large",
        color: PixelUI.theme.styles.colorLightAccent,
        fixedWidth: GAME_WIDTH,
        align: "left",
        padding: { x: 20, y: 20 },
      }
    );

    PixelUI.add
      .textLabel(this, centerX, centerY, "おはようございます")
      .setOrigin(0.5);

    this.tapToStartText = PixelUI.add.textLabel(
      this,
      0,
      GAME_HEIGHT - 260,
      "Tap to Start",
      {
        textSize: "small",
        fixedWidth: GAME_WIDTH,
        align: "center",
      }
    );

    this.tweens.add({
      targets: this.tapToStartText,
      alpha: { from: 0, to: 1 },
      ease: "CubicOut",
      duration: 800,
      repeat: -1,
      yoyo: true,
    });

    PixelUI.add.dialog(
      this,
      (e) => {
        console.log(e);
      },
      {}
    );
  }

  private showDialog(): void {
    // PixelUI.add.
  }

  private startGame(): void {
    this.sfxAudioSprites.play("se_select");
    this.cameras.main.flash(100);
    this.cameras.main.shake(100, 0.01);
  }
}
