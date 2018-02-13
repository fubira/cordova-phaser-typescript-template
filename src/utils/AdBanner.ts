import * as Logger from 'js-logger';
import { isNullOrUndefined } from 'util';

export default class AdBanner {
    private static get isActive(): boolean {
        return (!isNullOrUndefined(window.cordova) && !isNullOrUndefined(admob));
    }

    private static getId(): string {
        if (window.cordova.platformId === 'ios') {
            return process.env.IOS_ADMOB_ID_BANNER;
        } else {
            return process.env.ANDROID_ADMOB_ID_BANNER;
        }
    }

    public static init() {
        if (!AdBanner.isActive) {
            Logger.error('AdBanner.init AdBanner is not active.');
            return;
        }

        try {
            admob.banner.config({ id: AdBanner.getId(), overlap: true, isTesting: DEBUG });
            admob.banner.prepare();
        } catch (e) {
            Logger.error('AdBanner.init failed: ' + e);
        }
    }

    public static show() {
        if (!AdBanner.isActive) {
            return;
        }

        try {
            admob.banner.show();
        } catch (e) {
            Logger.error('AdBanner.showBanner failed: ' + e);
        }
    }

    public static hide() {
        if (!AdBanner.isActive) {
            return;
        }

        try {
            admob.banner.hide();
        } catch (e) {
            Logger.error('AdBanner.hideBanner failed: ' + e);
        }
    }
}
