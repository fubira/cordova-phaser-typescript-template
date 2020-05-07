import * as Logger from "js-logger";
import i18next from "i18next";
import AdBanner from "./utils/AdBanner";
import AdInterstitial from "./utils/AdInterstitial";
import Tracking from "./utils/Tracking";

function showExitAppDialog(): void {
  navigator.notification.confirm(
    i18next.t("close_dialog_message"),
    (choice) => {
      if (choice === 1) {
        Logger.info("exitApp");
        navigator.app.exitApp();
      }
    },
    i18next.t("close_dialog_title")
  );
}

function setDeviceReady(resolve): void {
  document.addEventListener("deviceready", () => {
    SpinnerDialog.show(null, "loading ...");

    AdBanner.init();
    AdInterstitial.init();
    Tracking.auth();

    window.StatusBar.styleDefault();

    if (
      window.cordova.platformId === "android" ||
      window.cordova.platformId === "ios"
    ) {
      window.StatusBar.overlaysWebView(true);
      window.StatusBar.backgroundColorByHexString("#A0483C46");
      window.StatusBar.styleBlackTranslucent();
    }

    // Setup localization for cordova devices
    navigator.globalization.getPreferredLanguage(
      (language) => {
        Logger.info("ChangeLanguage: [" + language.value + "]");
        i18next.changeLanguage(language.value);
      },
      (error: GlobalizationError) => {
        Logger.error("ChangeLanguage Error: " + error);
      }
    );

    // hook backbutton event
    document.addEventListener(
      "backbutton",
      (): void => {
        showExitAppDialog();
      },
      false
    );

    resolve();
  });
}

const Device = {
  init: async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (window.cordova) {
        setDeviceReady(resolve);
      } else {
        resolve();
      }
    });
  },
};

export default Device;
