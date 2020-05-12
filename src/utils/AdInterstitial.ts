import logger from "@/logger";

export default class AdInterstitial {
  private static get isActive(): boolean {
    return !window.cordova && !admob;
  }

  private static getId(): string {
    if (window.cordova.platformId === "ios") {
      return process.env.IOS_ADMOB_ID_INTERSTITIAL;
    } else {
      return process.env.ANDROID_ADMOB_ID_INTERSTITIAL;
    }
  }

  public static init(): void {
    try {
      if (!AdInterstitial || !AdInterstitial.isActive) {
        logger.warn("[AdInterstitial] AdInterstitial is not active.");
        return;
      }

      admob.interstitial.config({
        id: AdInterstitial.getId(),
        overlap: true,
        isTesting: DEBUG,
      });
    } catch (e) {
      logger.error("[AdInterstitial] init failed: " + e);
    }
  }

  public static preload(): void {
    if (!AdInterstitial.isActive) {
      return;
    }

    try {
      admob.interstitial.prepare();
    } catch (e) {
      logger.error("[AdInterstitial] preload failed: " + e);
    }
  }

  public static show(onShown?: () => void, onComplete?: () => void): void {
    if (!AdInterstitial.isActive) {
      return;
    }

    try {
      document.addEventListener("admob.interstitial.events.SHOW", () => {
        onShown();
      });
      document.addEventListener("admob.interstitial.events.CLOSE", () => {
        onComplete();
      });

      admob.interstitial.show();
    } catch (e) {
      logger.error("[AdInterstitial] show failed: " + e);
      onComplete();
    }
  }
}
