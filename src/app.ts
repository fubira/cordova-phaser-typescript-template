import 'p2';
import 'pixi';
import 'phaser';
import * as Logger from 'js-logger';

import * as WebFontLoader from 'webfontloader';
import * as Assets from './assets';
import Boot from './states/Boot';
import Preloader from './states/Preloader';
import Title from './states/Title';

class App extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super (config);
        this.state.add('Boot', Boot);
        this.state.add('Preloader', Preloader);
        this.state.add('Title', Title);
        this.state.start('Boot');
    }
}

function startApp(): void {
    let gameWidth: number = GAME_WIDTH;
    let gameHeight: number = GAME_HEIGHT;

    let gameConfig: Phaser.IGameConfig = {
        enableDebug: false,
        width: gameWidth,
        height: gameHeight,
        renderer: Phaser.AUTO,
        parent: '',
        resolution: 1
    };

    let app = new App(gameConfig);
}

function loadWebFont(callback: () => any): void {
    let webFontLoaderOptions: any = null;

    if (Object.keys(Assets.CustomWebFonts).length > 0) {
        webFontLoaderOptions = {};
        webFontLoaderOptions.custom = {
            families: [],
            urls: []
        };

        for (let font in Assets.CustomWebFonts) {
            webFontLoaderOptions.custom.families.push(Assets.CustomWebFonts[font].getFamily());
            webFontLoaderOptions.custom.urls.push(Assets.CustomWebFonts[font].getCSS());
        }
    }

    if (webFontLoaderOptions !== null) {
        webFontLoaderOptions.active = callback;
        WebFontLoader.load(webFontLoaderOptions);
    } else {
        callback();
    }
}

Logger.useDefaults();
Logger.setLevel((DEBUG) ? Logger.DEBUG : Logger.ERROR);

if (window.cordova) {
    document.addEventListener('deviceready', () => {
        try {
            Logger.debug('adId => ' + process.env.ADMOB_ID);
            AdMob.createBanner({
                adId: process.env.ADMOB_ID,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                overlap: true,
                autoShow: true
            });
        } catch (e) {
            Logger.error('AdMob.createBanner failed: ' + e);
        }
   });
}

window.onload = () => {
    loadWebFont(() => {
        startApp();
    });
};
