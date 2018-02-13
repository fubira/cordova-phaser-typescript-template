import * as Logger from 'js-logger';
import { isNullOrUndefined } from 'util';

export default class LocalStorage {
    public static get highScore(): number {
        let highscore: number = 0;
        try {
            let value = window.localStorage.getItem('highscore');
            if (!isNullOrUndefined(value))
                highscore = parseInt(value);
        } catch (e) {
            Logger.warn('LocalStorage.getHighScore failed: ' + e);
        }
        return highscore;
    }

    public static set highScore(highscore: number) {
        try {
            window.localStorage.setItem('highscore', highscore.toString());
        } catch (e) {
            Logger.warn('LocalStorage.setHighScore failed:' + e);
        }
    }
}
