import logger from "@/logger";

export default class AdBanner {
  private static get isActive(): boolean {
    return !window.cordova && !admob;
  }

  private static getId(): string {
    if (window.cordova.platformId === "ios") {
      return process.env.IOS_ADMOB_ID_BANNER;
    } else {
      return process.env.ANDROID_ADMOB_ID_BANNER;
    }
  }

  public static init(): void {
    try {
      if (!AdBanner || !AdBanner.isActive) {
        logger.error("[AdBanner] init failed: AdBanner is not active.");
        return;
      }

      admob.banner.config({
        id: AdBanner.getId(),
        overlap: true,
        isTesting: DEBUG,
      });
      admob.banner.prepare();
    } catch (e) {
      logger.error("[AdBanner] init failed: " + e);
    }
  }

  public static show(): void {
    if (!AdBanner.isActive) {
      return;
    }

    try {
      admob.banner.show();
    } catch (e) {
      logger.error("[AdBanner] showBanner failed: " + e);
    }
  }

  public static hide(): void {
    if (!AdBanner.isActive) {
      return;
    }

    try {
      admob.banner.hide();
    } catch (e) {
      logger.error("[AdBanner] hideBanner failed: " + e);
    }
  }
}
