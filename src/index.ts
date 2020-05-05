import * as Logger from "js-logger";
import i18next from "i18next";
import i18nXHRBackend from "i18next-xhr-backend";
import i18nBrowserLanguageDetector from "i18next-browser-languagedetector";
import * as WebFontLoader from "webfontloader";
import App from "./app";
import Device from "./device";

async function loadWebFont(): Promise<void> {
  return new Promise((resolve) => {
    const webFontLoaderOptions = null;

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

    webFontLoaderOptions.active = (): void => {
      resolve();
    };
    WebFontLoader.load(webFontLoaderOptions);
  });
}

async function loadLocales(): Promise<unknown> {
  return i18next
    .use(i18nBrowserLanguageDetector)
    .use(i18nXHRBackend)
    .init({
      fallbackLng: "en",
      backend: {
        loadPath: "locales/{{lng}}/{{ns}}.json",
      },
      debug: DEBUG,
    });
}

Logger.useDefaults();
Logger.setLevel(DEBUG ? Logger.DEBUG : Logger.ERROR);

window.onload = async (): Promise<void> => {
  await loadLocales();
  await loadWebFont();
  await Device.init();
  App.start();
};