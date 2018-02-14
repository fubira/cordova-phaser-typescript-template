import { AssetLoader } from '../utils/AssetLoader';
import * as Assets from '../assets';
import * as Logger from 'js-logger';
import BgmPlayer from '../utils/BgmPlayer';

export default class Preloader extends Phaser.State {
    private preloadBarSprite: Phaser.Sprite = null;
    private preloadFrameSprite: Phaser.Sprite = null;

    public init(): void {
        this.game.stage.backgroundColor = '#000000';
    }

    public preload(): void {
        AssetLoader.loadAllAssets(this.game, this.onCompleteLoadAll, this);
    }

    public create(): void {
    }

    private onCompleteLoadAll(): void {
        this.game.camera.onFadeComplete.addOnce(this.startGame, this);
        this.game.camera.fade(0x000000, 100);
    }

    private startGame(): void {
        this.game.state.start('Title');
        this.game.sound.boot();

        BgmPlayer.instance.init();
        BgmPlayer.instance.play([Assets.Audio.AudioBgm.getMP3(), Assets.Audio.AudioBgm.getOGG()]);
    }
}
