#!/bin/bash

if [ "x$ANDROID_KEYSTORE_BASE64" = "x" ]; then
  echo Android keystore is not found.
  exit 0
fi

echo Setup Android keystore...
echo $ANDROID_KEYSTORE_BASE64 | base64 -d > "/tmp/build.keystore"
cat << EOS > ./build.json
{  
  "android":{  
    "release":{  
      "keystore":"/tmp/build.keystore",
      "storePassword":"$ANDROID_KEYSTORE_PASSWORD",
      "alias":"$ANDROID_KEY_ALIAS",
      "password":"$ANDROID_KEY_PASSWORD",
      "keystoreType":"JKS"
    }
  }
}
EOS
keytool -list -v -keystore /tmp/build.keystore -storepass $ANDROID_KEYSTORE_PASSWORD
