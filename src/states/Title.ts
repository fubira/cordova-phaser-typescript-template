import * as Assets from '../assets';

export default class Title extends Phaser.State {
    private titleText: Phaser.Text = null;
    private subtitleText: Phaser.Text = null;
    private tapToStartText: Phaser.Text = null;

    public init(): void {
        this.game.stage.backgroundColor = '#000000';
        this.game.time.advancedTiming = true;
    }

    public create(): void {
        this.game.camera.flash(0x000000, 400);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.input.onDown.add(
            (pointer) => {
                this.startGame();
            }, this);

        if (window.cordova) {
            SpinnerDialog.hide();
        }

        this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 60, 'Cordova Phaser Template', {
            font: '54px ' + Assets.CustomWebFonts.FontsK8x12.getFamily()
        });
        this.titleText.anchor.setTo(0.5);
        this.titleText.fill = '#ee8855';
        this.titleText.stroke = '#000000';
        this.titleText.strokeThickness = 5;
        this.titleText.shadowStroke = true;
        this.titleText.shadowFill = true;
        this.titleText.shadowColor = 'rgba(0,0,0,0.3)';
        this.titleText.shadowBlur = 4;
        this.titleText.shadowOffsetX = 4;
        this.titleText.shadowOffsetY = 4;

        this.subtitleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 0, 'SubTile', {
            font: '26px ' + Assets.CustomWebFonts.FontsK8x12.getFamily()
        });
        this.subtitleText.anchor.setTo(0.5);
        this.subtitleText.fill = '#ffffff';
        this.subtitleText.stroke = '#000000';
        this.subtitleText.strokeThickness = 5;
        this.subtitleText.shadowStroke = true;
        this.subtitleText.shadowFill = true;
        this.subtitleText.shadowColor = 'rgba(0,0,0,0.3)';
        this.subtitleText.shadowBlur = 4;
        this.subtitleText.shadowOffsetX = 4;
        this.subtitleText.shadowOffsetY = 4;

        this.tapToStartText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Tap to start', {
            font: '26px ' + Assets.CustomWebFonts.FontsK8x12.getFamily()
        });
        this.tapToStartText.anchor.setTo(0.5);
        this.tapToStartText.fill = '#ffffff';
        this.tapToStartText.stroke = '#000000';
        this.tapToStartText.strokeThickness = 5;
        this.tapToStartText.shadowStroke = true;
        this.tapToStartText.shadowFill = true;
        this.tapToStartText.shadowColor = 'rgba(0,0,0,0.3)';
        this.tapToStartText.shadowBlur = 4;
        this.tapToStartText.shadowOffsetX = 4;
        this.tapToStartText.shadowOffsetY = 4;

        this.game.add.tween(this.tapToStartText)
            .to({alpha: 0}, 500, Phaser.Easing.Cubic.Out).delay(1000)
            .to({alpha: 1}, 500, Phaser.Easing.Cubic.In).loop(true)
            .start();
    }

    private startGame(): void {
    }
}
