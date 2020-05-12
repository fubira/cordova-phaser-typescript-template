import logger from "@/logger";

export default class LocalStorage {
  public static get highScore(): number {
    let highscore = 0;
    try {
      const value = window.localStorage.getItem("highscore");
      if (!value) {
        highscore = parseInt(value, 10);
      }
    } catch (e) {
      logger.warn("[LocalStorage] getHighScore failed: " + e);
    }
    return highscore;
  }

  public static set highScore(highscore: number) {
    try {
      window.localStorage.setItem("highscore", highscore.toString());
    } catch (e) {
      logger.warn("[LocalStorage] setHighScore failed:" + e);
    }
  }
}
