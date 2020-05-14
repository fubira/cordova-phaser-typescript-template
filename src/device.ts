import logger from "@/logger";
import i18next from "i18next";
import AdBanner from "@/utils/AdBanner";
import AdInterstitial from "@/utils/AdInterstitial";
import Tracking from "@/utils/Tracking";

function showExitAppDialog(): void {
  navigator.notification.confirm(
    i18next.t("close_dialog_message"),
    (choice) => {
      if (choice === 1) {
        logger.info("exitApp");
        navigator.app.exitApp();
      }
    },
    i18next.t("close_dialog_title")
  );
}

function setup(): Promise<void> {
  return new Promise((resolve) => {
    try {
      AdBanner.init();
      AdInterstitial.init();
    } catch (err) {
      logger.error("[Device] Ad initialize failed");
    }

    try {
      Tracking.auth();
    } catch (err) {
      logger.error("[Device] Tracking initialize failed");
    }

    try {
      window.StatusBar.styleDefault();
      if (
        window.cordova.platformId === "android" ||
        window.cordova.platformId === "ios"
      ) {
        window.StatusBar.overlaysWebView(true);
        window.StatusBar.backgroundColorByHexString("#A0483C46");
        window.StatusBar.styleBlackTranslucent();
      }
    } catch (err) {
      logger.error("[Device] Statusbar setting failed");
    }

    try {
      // Setup localization for cordova devices
      navigator.globalization.getPreferredLanguage(
        (language) => {
          logger.info("ChangeLanguage: [" + language.value + "]");
          i18next.changeLanguage(language.value);
        },
        (error: GlobalizationError) => {
          logger.error("ChangeLanguage Error: " + error);
        }
      );
    } catch (err) {
      logger.error("[Device] globalization setting failed");
    }

    document.addEventListener(
      "backbutton",
      function (e) {
        e.preventDefault();
        showExitAppDialog();
      },
      false
    );

    navigator.splashscreen.hide();
    resolve();
  });
}

const Device = {
  init: (): Promise<void> => {
    return new Promise((resolve) => {
      if (/^(http|https)/.exec(document.URL)) {
        logger.log("[Device] Running on Web plaform");
        resolve();
      } else {
        logger.log("[Device] Running on Cordova plaform");
        document.addEventListener("deviceready", () => {
          setup()
            .catch((err) => {
              logger.error("[Device] setup failed: ", err);
            })
            .finally(() => {
              logger.log("[Device] ready");
              resolve();
            });
        });
      }
    });
  },
};

export default Device;
