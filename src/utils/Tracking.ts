import * as Logger from 'js-logger';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';

export default class Tracking {
    public static auth() {
        try {
            let config = {
                apiKey: process.env.FIREBASE_APP_KEY,
                authDomain: process.env.FIREBASE_AUTH_DOMAIN
            };

            firebase.initializeApp(config);
            Logger.info('Tracking::auth');
            firebase.auth().signInAnonymously().catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                Logger.error('Firebase auth: [' + errorCode + ']: ' + errorMessage);
            });
        } catch (e) {
            Logger.error('Tracking::auth failed: ' + e);
        }
    }
}
