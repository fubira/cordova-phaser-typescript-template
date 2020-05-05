declare class GamesServices {
  auth(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  signOut(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  isSignedIn(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  submitScore(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  getPlayerScore(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  showLeaderboard(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  showAllLeaderboards(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  unlockAchievement(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  incrementAchievement(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  incrementAchievementNow(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  showAchievements(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
  showPlayer(
    success?: Function,
    failure?: Function,
    data?: Record<string, any>
  ): void;
}

declare interface Window {
  gamesServices: GamesServices;
}
