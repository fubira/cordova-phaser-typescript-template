import * as Assets from "../assets";

export default class TitlScene extends Phaser.Scene {
  private titleText: Phaser.GameObjects.Text = null;
  private subtitleText: Phaser.GameObjects.Text = null;
  private tapToStartText: Phaser.GameObjects.Text = null;

  public init(): void {
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(
      "#483C46"
    );
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

    this.titleText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 60,
      "Cordova Phaser Template",
      { font: "50px " + Assets.CustomWebFonts.FontsK8X12.getFamily() }
    );

    this.titleText.setOrigin(0.5, 0.5);
    this.titleText.setFill("#EE8855");
    this.titleText.setStroke("#000000", 5);
    this.titleText.setShadow(4, 4, "rgba(0,0,0,0.3)", 4, true, true);

    this.subtitleText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 0,
      "SubTile",
      { font: "32px " + Assets.CustomWebFonts.FontsK8X12.getFamily() }
    );

    this.subtitleText.setOrigin(0.5, 0.5);
    this.subtitleText.setFill("#EE8855");
    this.subtitleText.setStroke("#000000", 5);
    this.subtitleText.setShadow(4, 4, "rgba(0,0,0,0.3)", 4, true, true);

    this.tapToStartText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 100,
      "Tap to start",
      { font: "32px " + Assets.CustomWebFonts.FontsK8X12.getFamily() }
    );

    this.tapToStartText.setOrigin(0.5, 0.5);
    this.tapToStartText.setFill("#BEEE62");
    this.tapToStartText.setStroke("#000000", 5);
    this.tapToStartText.setShadow(4, 4, "rgba(0,0,0,0.3)", 4, true, true);

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
    this.cameras.main.flash(200);
  }
}
