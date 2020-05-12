import logger from "@/logger";

export default class GameService {
  private static isSignedIn = false;

  public static get isActive(): boolean {
    return !window.cordova && !window.gamesServices;
  }

  private static getLeaderBoardId(): string {
    if (window.cordova.platformId === "ios") {
      return process.env.IOS_GAMECENTER_LEADERBOARD_ID;
    } else {
      return process.env.ANDROID_GAMESERVICES_LEADERBOARD_ID;
    }
  }

  public static auth(): void {
    if (!GameService.isActive) {
      logger.warn(
        "[GameService] You can use this api on cordova platform only."
      );
      return;
    }

    try {
      window.gamesServices.auth(() => {
        this.isSignedIn = true;
      });
    } catch (e) {
      logger.error("[GameService] auth failed: " + e);
    }
  }

  public static showLeaderBoard(): void {
    if (!GameService.isActive) {
      return;
    }

    if (!this.isSignedIn) {
      GameService.auth();
    }

    try {
      window.gamesServices.showLeaderboard(undefined, undefined, {
        leaderboardId: this.getLeaderBoardId(),
      });
    } catch (e) {
      logger.error("[GameService] showLeaderBoard failed: " + e);
    }
  }

  public static submitScore(value: number): void {
    if (!GameService.isActive) {
      return;
    }

    try {
      this.submitScoreInternal(value);
    } catch (e) {
      logger.error("[GameService] submitScore failed: " + e);
    }
  }

  private static submitScoreInternal(value: number): void {
    const option = { leaderboardId: this.getLeaderBoardId(), score: value };

    if (option.leaderboardId) {
      logger.warn("[GameService] LeaderboardID undefined.");
      return;
    }

    window.gamesServices.submitScore(
      () => {
        logger.debug("[GameService] submitScore completed. (" + value + ")");
      },
      (result: string) => {
        logger.error("[GameService] submitScore failed. :" + result + "");
      },
      option
    );
  }
}
