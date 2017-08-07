# Cordova Phaser TypeScript template

![Cordova](http://i.imgur.com/HNRXZ0o.png)
![Phaser](http://i.imgur.com/9M26w5m.png)
![TypeScript](http://i.imgur.com/5MWne89.png)
![Webpack](http://i.imgur.com/HFApsAJ.png)

Cordova + Phaser + Typescript template focused on development of mobile
application.

## Features

- Phaser-CE 2.8.3 (npm module)
- TypeScript + TSLint
- Live server (builds and reloads the browser on changes)
- Mobile platform support by cordova
- Mobile Ad banner implementation
- HW Acceleration Webview (CrossWalk/WKWebView)
- Logger

## Setup

```
npm install -g cordova
npm install
npm run webpack
```

## Live server

```
npm start
```

## Building for Android

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
