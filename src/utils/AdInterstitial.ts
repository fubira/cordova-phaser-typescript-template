import * as Logger from 'js-logger';
import { isNullOrUndefined } from 'util';

export default class AdInterstitial {
    private static get isActive(): boolean {
        return (!isNullOrUndefined(window.cordova) && !isNullOrUndefined(admob));
    }

    private static getId(): string {
        if (window.cordova.platformId === 'ios') {
            return process.env.IOS_ADMOB_ID_INTERSTITIAL;
        } else {
            return process.env.ANDROID_ADMOB_ID_INTERSTITIAL;
        }
    }

    public static init() {
        if (!AdInterstitial.isActive) {
            Logger.warn('AdInterstitial.init AdBanner is not active.');
            return;
        }

        try {
            admob.interstitial.config({ id: AdInterstitial.getId(), overlap: true, isTesting: DEBUG });
        } catch (e) {
            Logger.error('AdInterstitial.init failed: ' + e);
        }
    }

    public static preload() {
        if (!AdInterstitial.isActive) {
            return;
        }

        try {
            admob.interstitial.prepare();
        } catch (e) {
            Logger.error('AdInterstitial.init failed: ' + e);
        }
    }

    public static show(onShown?: Function, onComplete?: Function) {
        if (!AdInterstitial.isActive) {
            return;
        }

        try {
            document.addEventListener('admob.interstitial.events.SHOW', function(event) {
                onShown();
            });
            document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
                onComplete();
            });

            admob.interstitial.show();
        } catch (e) {
            Logger.error('AdInterstitial.show failed: ' + e);
            onComplete();
        }
    }
}
