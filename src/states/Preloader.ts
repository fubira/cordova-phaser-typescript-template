import { AssetLoader } from '../utils/AssetLoader';

export default class Preloader extends Phaser.State {
    private preloadBarSprite: Phaser.Sprite = null;
    private preloadFrameSprite: Phaser.Sprite = null;

    public init(): void {
        this.game.stage.backgroundColor = '#000000';
    }

    public preload(): void {
        AssetLoader.loadAllAssets(this.game, this.waitForSoundDecoding, this);
    }

    public create(): void {
        this.startGame();
    }

    private waitForSoundDecoding(): void {
    }

    private startGame(): void {
        this.game.camera.onFadeComplete.addOnce(this.loadTitle, this);
        this.game.camera.fade(0x000000, 100);
    }

    private loadTitle(): void {
        this.game.state.start('Title');
    }
}
