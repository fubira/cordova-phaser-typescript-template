declare class Banner {
  config(options: Record<string, any>);
  prepare();
  show();
  hide();
  remove();
}

declare class Interstitial {
  config(options: Record<string, any>);
  prepare();
  show();
}

declare class RewardVideo {
  config(options: Record<string, any>);
  prepare();
  show();
}

declare interface AdMob {
  banner: Banner;
  interstitial: Interstitial;
  rewardvideo: RewardVideo;
}

declare const admob: AdMob;
