# Cordova Phaser TypeScript template

![Cordova](http://i.imgur.com/HNRXZ0o.png)
![Phaser](http://i.imgur.com/9M26w5m.png)
![TypeScript](http://i.imgur.com/5MWne89.png)
![Webpack](http://i.imgur.com/HFApsAJ.png)

Cordova + Phaser + Typescript template focused on development of mobile
application.

## Dependency

- node-js 12.x


## Features

- Phaser-CE 2.13.0
- TypeScript + TSLint
- Live server (builds and reloads the browser on changes)
- BGM Manager (Howler.js)
- Mobile platform support (cordova)
- Firebase analytics (cordova-plugin-firebase)
- AdMob implementation (lycwed-cordova-plugin-admob-free)
- GameService/GameCenter support (lycwed-cordova-plugin-game-services)
- ~~HW Acceleration Webview (CrossWalk/WKWebView)~~
- Logger (js-logger)
- Globalization (i18n)
- Testing framework (karma)

## Setup

```
npm install -g cordova
npm install
npm run webpack
```

## Run live server

```
npm start
```

## Build for Android

```
cordova platform add android
npm run webpack
cordova build android
```

## Build for iOS

```
cordova platform add ios
npm run webpack
cordova build ios
```

## When fail in installation of nodegyp/grpc

When you fail in installation of nodegyp/grpc, please install 
nodegyp/grpc using LTS version node-js at first.

```
nodebrew use v9.11.2
npm install -g nodegyp
npm install --save grpc
nodebrew use latest
npm install
```

