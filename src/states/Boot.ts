export default class Boot extends Phaser.State {
    public init(): void {
        this.game.stage.backgroundColor = '#000000';
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.refresh();
    }

    public preload(): void {
    }

    public create(): void {
        this.game.state.start('Preloader');
    }
}
