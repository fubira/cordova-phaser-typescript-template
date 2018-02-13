import * as Logger from 'js-logger';
import { isNullOrUndefined } from 'util';

export default class GameService {
    private static isSignedIn = false;

    public static get isActive(): boolean {
        return (!isNullOrUndefined(window.cordova) && !isNullOrUndefined(window.gamesServices));
    }

    private static getLeaderBoardId(): string {
        if (window.cordova.platformId === 'ios') {
            return process.env.IOS_GAMECENTER_LEADERBOARD_ID;
        } else {
            return process.env.ANDROID_GAMESERVICES_LEADERBOARD_ID;
        }
    }

    public static auth() {
        if (!GameService.isActive) {
            Logger.warn('GameService disabled. You can use this api on cordova platform only.');
            return;
        }

        try {
            window.gamesServices.auth(() => {
                this.isSignedIn = true;
            });
        } catch (e) {
            Logger.error('GameService:auth failed: ' + e);
        }
    }

    public static showLeaderBoard() {
        if (!GameService.isActive) {
            return;
        }

        if (!this.isSignedIn) {
            GameService.auth();
        }

        try {
            window.gamesServices.showLeaderboard(undefined, undefined, { leaderboardId: this.getLeaderBoardId() });
        } catch (e) {
            Logger.error('GameService:showLeaderBoard failed: ' + e);
        }
    }

    public static submitScore(value: number) {
        if (!GameService.isActive) {
            return;
        }

        try {
            this.submitScoreInternal(value);
        } catch (e) {
            Logger.error('GameService:submitScore failed: ' + e);
        }
    }

    private static submitScoreInternal(value: number) {
        let option = {leaderboardId: this.getLeaderBoardId(), score: value};

        if (isNullOrUndefined(option.leaderboardId) ) {
            Logger.warn('GameService: LeaderboardID undefined.');
            return;
        }

        window.gamesServices.submitScore(
            () => {
                Logger.debug('GameService: submitScore completed. (' + value + ')');
            },
            (result) => {
                Logger.error('GameService: submitScore failed. :' + result + '');
            }, option);
    }
}
