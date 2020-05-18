import i18next from "i18next";
import i18nXHRBackend from "i18next-xhr-backend";
import i18nBrowserLanguageDetector from "i18next-browser-languagedetector";
import * as WebFontLoader from "webfontloader";
import * as Assets from "@/assets";
import App from "@/app";
import Device from "@/device";

async function loadWebFont(): Promise<void> {
  return new Promise((resolve) => {
    let webFontLoaderOptions = null;

    if (Object.keys(Assets.CustomWebFonts).length > 0) {
      webFontLoaderOptions = {};
      webFontLoaderOptions.custom = {
        families: [],
        urls: [],
      };

      for (const font of Object.keys(Assets.CustomWebFonts)) {
        webFontLoaderOptions.custom.families.push(
          Assets.CustomWebFonts[font].getFamily()
        );
        webFontLoaderOptions.custom.urls.push(
          Assets.CustomWebFonts[font].getCSS()
        );
      }
    }

    if (webFontLoaderOptions === null) {
      resolve();
      return;
    }

    webFontLoaderOptions.active = (): void => {
      resolve();
    };
    console.log(webFontLoaderOptions);
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

window.onload = async (): Promise<void> => {
  await Device.init();
  await loadLocales();
  await loadWebFont();
  App.start();
};
