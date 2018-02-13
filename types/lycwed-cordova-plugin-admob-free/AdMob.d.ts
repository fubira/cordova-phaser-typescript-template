declare class Banner {
	config(options: Object);
	prepare();
	show(); 
	hide();
	remove();
}

declare class Interstitial {
	config(options: Object);
	prepare();
	show();
}

declare class RewardVideo {
	config(options: Object);
	prepare();
	show();
}

declare interface AdMob {
	banner: Banner;
	interstitial: Interstitial;
	rewardvideo: RewardVideo;
}

declare var admob: AdMob;
