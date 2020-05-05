import { Howl } from "howler";
import { isNullOrUndefined } from "util";

export default class BgmPlayer {
  public static instance_: BgmPlayer;
  public static get instance(): BgmPlayer {
    if (!this.instance_) {
      this.instance_ = new BgmPlayer();
    }
    return this.instance_;
  }

  public volume = 0.8;
  private audioPlaying: Howl;
  private audioFading: Howl;

  private static playAudio(src: Array<string>, volume = 1.0): Howl {
    const audio = new Howl({ src, loop: true, autoplay: true, volume: 0 });
    audio.fade(0.0, volume, 500);
    return audio;
  }

  public init(): void {
    document.addEventListener("pause", () => {
      if (!isNullOrUndefined(this.audioPlaying)) {
        this.audioPlaying.pause();
      }
      if (!isNullOrUndefined(this.audioFading)) {
        this.audioFading.stop();
      }
    });
    document.addEventListener("resume", () => {
      if (
        !isNullOrUndefined(this.audioPlaying) &&
        !this.audioPlaying.playing()
      ) {
        this.audioPlaying.play();
      }
    });
  }

  public play(src: Array<string>): void {
    this.fadeOut();
    this.audioPlaying = BgmPlayer.playAudio(src, this.volume);
  }

  private fadeOut(): void {
    this.audioFading = this.audioPlaying;
    this.audioPlaying = undefined;

    if (!isNullOrUndefined(this.audioFading) && this.audioFading.playing()) {
      this.audioFading.fade(this.audioFading.volume(), 0.0, 800);
      this.audioFading.once("fade", () => {
        this.audioFading.stop();
        this.audioFading = undefined;
      });
    }
  }
}
