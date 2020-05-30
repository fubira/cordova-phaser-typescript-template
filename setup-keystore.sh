#!/bin/bash
if [ "$1" = "debug"]; then
  BUILD_TYPE="debug"
else
  BUILD_TYPE="release"
fi


if [ "x$ANDROID_KEYSTORE_BASE64" = "x" ]; then
  echo Android keystore is not found.
  exit 0
fi

echo Setup Android keystore...
echo $ANDROID_KEYSTORE_BASE64 | base64 -d > "./build.keystore"
cat << EOS > ./build.json
{
  "android":{
    "$BUILD_TYPE":{
      "keystore":"./build.keystore",
      "storePassword":"$ANDROID_KEYSTORE_PASSWORD",
      "alias":"$ANDROID_KEY_ALIAS",
      "password":"$ANDROID_KEY_PASSWORD",
      "keystoreType":"JKS"
    }
  }
}
EOS
cat build.json
keytool -list -v -keystore ./build.keystore -storepass $ANDROID_KEYSTORE_PASSWORD
