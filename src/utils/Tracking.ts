import logger from "@/logger";
import * as firebase from "firebase";

export default class Tracking {
  public static auth(): void {
    try {
      const config = {
        apiKey: process.env.FIREBASE_APP_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      };

      firebase.initializeApp(config);
      logger.info("[Tracking] auth");
      firebase
        .auth()
        .signInAnonymously()
        .catch((error): void => {
          const errorCode = error.code;
          const errorMessage = error.message;
          logger.error(
            "[Tracking] Firebase auth: [" + errorCode + "]: " + errorMessage
          );
        });
    } catch (e) {
      logger.error("[Tracking] auth failed: " + e);
    }
  }
}
