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
    this.cameras.main.flash(400, 0, 0, 0);
    const spaceKey = this.input.keyboard.addKey("SPACE");

    spaceKey.on("down", () => {
      this.startGame();
    });
    this.input.on("pointerdown", () => {
      this.startGame();
    });

    PixelUI.add.textLabel(
      this,
      0,
      0,
      ["Hello Phaser!", "Multi Line", "日本語メッセージ"],
      {
        textSize: "large",
        color: PixelUI.theme.styles.colorLightAccent,
        fixedWidth: GAME_WIDTH,
        align: "right",
        padding: { x: 20, y: 20 },
      }
    );

    this.tapToStartText = PixelUI.add.textLabel(
      this,
      0,
      GAME_HEIGHT - 80,
      "Tap to Start",
      {
        textSize: "small",
        fixedWidth: GAME_WIDTH,
        align: "center",
      }
    );

    this.tweens.add({
      targets: [this.tapToStartText],
      alpha: { from: 0, to: 1 },
      ease: "CubicOut",
      duration: 800,
      repeat: -1,
      yoyo: true,
    });

    PixelUI.add.button(this, 180, 180, "Dialog", () => this.showDialog(), {});
  }

  private showDialog(): void {
    this.sfxAudioSprites.play("se_button_over");
    const dialog = PixelUI.add.dialog(
      this,
      "ダイアログテスト",
      [
        "Hello world! The quick brown fox jumps over the lazy dog! 1234567890 ",
        "",
        "おはようございます。",
        "今日も一日頑張りましょう。",
        // "",
        // "どんぐりころころ ドンブリコ お池にはまって さあ大変 どじょうが出て来て 今日は 坊ちゃん一緒に 遊びましょう",
      ],
      {
        buttons: [
          { text: "Ok", value: "ok" },
          { text: "キャンセル", value: "cancel" },
          // { text: "???", value: "???" },
        ],
        onSelect: (value) => {
          this.sfxAudioSprites.play("se_button_over");
          console.log(value);
          dialog.close();
        },
      }
    );
    dialog.open();
  }

  private startGame(): void {
    if (this.tapToStartText) {
      this.tapToStartText.destroy();
      this.tapToStartText = null;
    }
  }
}
