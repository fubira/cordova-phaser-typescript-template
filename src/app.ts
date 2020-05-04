import * as Logger from 'js-logger';
import * as Phaser from 'phaser';
import i18next from 'i18next';
import i18nXHRBackend from 'i18next-xhr-backend';
import i18nBrowserLanguageDetector from 'i18next-browser-languagedetector';
import * as WebFontLoader from 'webfontloader';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import TitleScene from './scenes/TitleScene';
import AdBanner from './utils/AdBanner';
import AdInterstitial from './utils/AdInterstitial';
import Tracking from './utils/Tracking';

class App extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super (config);
    this.scene.add('BootScene', BootScene);
    this.scene.add('PreloadScene', PreloadScene);
    this.scene.add('TitleScene', TitleScene);
    this.scene.start('BootScene');
  }
}

function startApp(): App {
  const gameWidth: number = GAME_WIDTH;
  const gameHeight: number = GAME_HEIGHT;
  const gameConfig: Phaser.Types.Core.GameConfig = {
    render: {
      pixelArt: false,
    },
    width: gameWidth,
    height: gameHeight,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: '',
    resolution: 1
  };

  return new App(gameConfig);
}

async function loadWebFont() {
  return new Promise((resolve) => {
    const webFontLoaderOptions: any = null;

    /*
    if (Object.keys(Assets.CustomWebFonts).length > 0) {
      webFontLoaderOptions = {};
      webFontLoaderOptions.custom = {
        families: [],
        urls: []
      };
      */

      /*
      for (const font of Assets.CustomWebFonts) {
        webFontLoaderOptions.custom.families.push(Assets.CustomWebFonts[font].getFamily());
        webFontLoaderOptions.custom.urls.push(Assets.CustomWebFonts[font].getCSS());
      }
    }
    */

    if (webFontLoaderOptions === null) {
      resolve();
      return;
    }

    webFontLoaderOptions.active = () => {
      resolve();
    };
    WebFontLoader.load(webFontLoaderOptions);
  });
}

async function loadLocales() {
  return i18next.use(i18nBrowserLanguageDetector)
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

window.onload = async () => {
  await loadLocales();
  await loadWebFont();
  startApp();
};

document.addEventListener('deviceready', () => {
  if (window.cordova) {
    SpinnerDialog.show(null, 'loading ...');
    AdBanner.init();
    AdInterstitial.init();

    window.StatusBar.styleDefault();
    if (window.cordova.platformId === 'android' ||
    window.cordova.platformId === 'ios') {
      window.StatusBar.overlaysWebView(true);
      window.StatusBar.backgroundColorByHexString('#A0483C46');
      window.StatusBar.styleBlackTranslucent();
    }

    // Setup localization for cordova devices
    navigator.globalization.getPreferredLanguage((language) => {
      Logger.info('ChangeLanguage: [' + language.value + ']');
      i18next.changeLanguage(language.value);
    }, (error: GlobalizationError) => {
      Logger.error('ChangeLanguage Error: ' + error);
    });

    document.addEventListener('backbutton', () => {
      navigator.notification.confirm(
        i18next.t('close_dialog_message'),
        (choice) => {
          if (choice === 1) {
            Logger.info('exitApp');
            navigator.app.exitApp();
          }
        },
        i18next.t('close_dialog_title'));
      },
      false);
    }
  });
