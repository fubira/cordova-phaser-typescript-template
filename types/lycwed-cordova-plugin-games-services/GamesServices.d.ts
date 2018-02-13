declare class GamesServices {
    auth(success?: Function, failure?: Function, data?: Object): void;
    signOut(success?: Function, failure?: Function, data?: Object): void;
    isSignedIn(success?: Function, failure?: Function, data?: Object): void;
    submitScore(success?: Function, failure?: Function, data?: Object): void;
    getPlayerScore(success?: Function, failure?: Function, data?: Object): void;
    showLeaderboard(success?: Function, failure?: Function, data?: Object): void;
    showAllLeaderboards(success?: Function, failure?: Function, data?: Object): void;
    unlockAchievement(success?: Function, failure?: Function, data?: Object): void;
    incrementAchievement(success?: Function, failure?: Function, data?: Object): void;
    incrementAchievementNow(success?: Function, failure?: Function, data?: Object): void;
    showAchievements(success?: Function, failure?: Function, data?: Object): void;
    showPlayer(success?: Function, failure?: Function, data?: Object): void;
}

declare interface Window {
    gamesServices: GamesServices;
}
