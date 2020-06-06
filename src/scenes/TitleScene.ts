import * as Assets from "@/assets";
import * as PixelUI from "@/pixelui";
import BgmPlayer from "@/utils/BgmPlayer";

export default class TitleScene extends Phaser.Scene {
  private tapToStartText: Phaser.GameObjects.GameObject = null;
  private debugInfo: PixelUI.DebugInfo;
  private sfxAudioSprites:
    | Phaser.Sound.WebAudioSound
    | Phaser.Sound.HTML5AudioSound = null;

  public init(): void {
    //
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
    const shaderWidth = this.cameras.main.width;
    const shaderHeight = this.cameras.main.height;
    this.add.shader(
      Assets.Shaders.ShadersShader.getName(),
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      shaderWidth,
      shaderHeight
    );

    const spaceKey = this.input.keyboard.addKey("SPACE");

    spaceKey.on("down", () => {
      this.startGame();
    });
    this.input.on("pointerdown", () => {
      this.startGame();
    });

    this.debugInfo = PixelUI.add.debugInfo(this);

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

    PixelUI.add.button(
      this,
      this.cameras.main.centerX,
      350,
      "Information Dialog",
      async () => await this.showDialog()
    );
    PixelUI.add.button(
      this,
      this.cameras.main.centerX,
      450,
      "Small Dialog",
      async () => await this.showDialogSmall()
    );
    PixelUI.add.button(
      this,
      this.cameras.main.centerX,
      550,
      "Toast",
      async () => await this.showToast()
    );
    PixelUI.add.toggleButton(
      this,
      this.cameras.main.centerX,
      650,
      "ToggleButton",
      async (toggle: boolean) => await this.showToggleState(toggle),
      true
    );
  }

  public update(): void {
    this.debugInfo.update();
  }

  private async showDialog(): Promise<void> {
    this.sfxAudioSprites.play("se_button_over");
    const dialog = PixelUI.add.dialog(
      this,
      "ダイアログテスト",
      [
        "Hello world! The quick brown fox jumps over the lazy dog! 1234567890 ",
        "",
        "おはようございます。",
        "今日も一日頑張りましょう。",
        "",
        "どんぐりころころ ドンブリコ お池にはまって さあ大変 どじょうが出て来て 今日は 坊ちゃん一緒に 遊びましょう",
      ],
      {
        buttons: [
          { text: "Ok", value: "ok" },
          { text: "キャンセル", value: "cancel" },
          { text: "???", value: "???" },
        ],
        onSelect: (value) => {
          this.sfxAudioSprites.play("se_button_over");
          console.log(value);
        },
      }
    );
    await dialog.open();
  }

  private async showDialogSmall(): Promise<void> {
    this.sfxAudioSprites.play("se_button_over");
    const dialog = PixelUI.add.dialog(this, null, "Are you Ok?", {
      buttons: [{ text: "Ok", value: "ok" }],
      backdropClose: true,
      onSelect: () => {
        this.sfxAudioSprites.play("se_button_over");
      },
    });
    await dialog.open();
  }

  index = 0;
  private async showToast(): Promise<void> {
    if (this.index % 3 === 0) {
      PixelUI.add.toast(
        this,
        undefined,
        `Hi! this is toast message! (${this.index})`,
        { verticalAlign: "top" }
      );
    }
    if (this.index % 3 === 1) {
      PixelUI.add.toast(
        this,
        "Success",
        `Hi! this is toast success! (${this.index})`,
        { verticalAlign: "top", type: "success" }
      );
    }
    if (this.index % 3 === 2) {
      PixelUI.add.toast(
        this,
        "Error",
        `Hi! this is toast danger! (${this.index})`,
        { verticalAlign: "top", type: "error" }
      );
    }
    this.index += 1;
    return Promise.resolve();
  }

  private async showToggleState(toggle: boolean): Promise<void> {
    PixelUI.add.toast(this, undefined, `Toggled! (${toggle})`, {
      verticalAlign: "top",
    });
    return Promise.resolve();
  }

  private startGame(): void {
    if (this.tapToStartText) {
      this.tapToStartText.destroy();
      this.tapToStartText = null;
    }
  }
}
