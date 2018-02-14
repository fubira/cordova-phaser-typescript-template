import 'p2';
import 'pixi';
import 'phaser';
import * as Logger from 'js-logger';
import * as i18n from 'i18next';
import * as i18nXHRBackend from 'i18next-xhr-backend';
import * as i18nBrowserLanguageDetector from 'i18next-browser-languagedetector';
import * as WebFontLoader from 'webfontloader';
import * as Assets from './assets';
import Boot from './states/Boot';
import Preloader from './states/Preloader';
import Title from './states/Title';
import AdBanner from './utils/AdBanner';
import AdInterstitial from './utils/AdInterstitial';
import Tracking from './utils/Tracking';

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
        antialias: false,
        enableDebug: DEBUG,
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

function loadLocales() {
    i18n.use(i18nBrowserLanguageDetector)
        .use(i18nXHRBackend)
        .init({
            fallbackLng: 'en',
            backend: {
                loadPath: 'locales/{{lng}}/{{ns}}.json'
            },
            debug: DEBUG
        });
}

Logger.useDefaults();
Logger.setLevel((DEBUG) ? Logger.DEBUG : Logger.ERROR);
Tracking.auth();

window.onload = () => {
    loadLocales();
    loadWebFont(() => {
        startApp();
    });
};

document.addEventListener('deviceready', () => {
    if (window.cordova) {
        SpinnerDialog.show(null, 'loading ...');
        AdBanner.init();
        AdInterstitial.init();

        window.StatusBar.styleDefault();
        if (window.cordova.platformId === 'android') {
            window.StatusBar.overlaysWebView(true);
            window.StatusBar.backgroundColorByHexString('#A0000000');
            window.StatusBar.styleBlackTranslucent();
        }
        if (window.cordova.platformId === 'ios') {
            window.StatusBar.overlaysWebView(true);
            window.StatusBar.backgroundColorByHexString('#A0000000');
            window.StatusBar.styleBlackTranslucent();
        }

        // Setup localization for cordova devices
        navigator.globalization.getPreferredLanguage((language) => {
            Logger.info('ChangeLanguage: [' + language.value + ']');
            i18n.changeLanguage(language.value);
        }, (error: GlobalizationError) => {
            Logger.error('ChangeLanguage Error: ' + error);
        });

        document.addEventListener('backbutton', () => {
            navigator.notification.confirm(
                i18n.t('close_dialog_message'),
                (choice) => {
                    if (choice === 1) {
                        Logger.info('exitApp');
                        navigator.app.exitApp();
                    }
                },
                i18n.t('close_dialog_title'));
            },
            false);
    }
});
