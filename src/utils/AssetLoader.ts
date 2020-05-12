import * as Assets from "@/assets";

export class AssetLoader {
  private static loader: Phaser.Loader.LoaderPlugin = null;
  private static soundKeys: string[] = [];
  private static soundExtensionsPreference: string[] = [
    "webm",
    "ogg",
    "m4a",
    "mp3",
    "aac",
    "ac3",
    "caf",
    "flac",
    "mp4",
    "wav",
  ];

  private static loadImages(): void {
    for (const key of Object.keys(Assets.Images)) {
      const asset = Assets.Images[key];
      const types = Object.getOwnPropertyNames(asset).filter(
        (method) => asset[method] instanceof Function && method !== "getName"
      );
      for (const type of types) {
        this.loader.image(asset.getName(), asset[type]());
      }
    }
  }

  private static loadSpritesheets(): void {
    for (const key of Object.keys(Assets.Spritesheets)) {
      const asset = Assets.Spritesheets[key];
      const types = Object.getOwnPropertyNames(asset).filter(
        (method) => asset[method] instanceof Function && method !== "getName"
      );
      for (const type of types) {
        this.loader.spritesheet(asset.getName(), asset[type](), {
          frameWidth: asset.getFrameWidth(),
          frameHeight: asset.getFrameHeight(),
          startFrame: 0,
          endFrame: asset.getFrameMax(),
          margin: asset.getMargin(),
          spacing: asset.getSpacing(),
        });
      }
    }
  }

  private static loadAtlases(): void {
    for (const key of Object.keys(Assets.Atlases)) {
      const asset = Assets.Atlases[key];
      const types = Object.getOwnPropertyNames(asset).filter(
        (method) => asset[method] instanceof Function && method !== "getName"
      );
      for (const type of types) {
        this.loader.atlas(asset.getName(), asset[type]());
      }
    }
  }

  private static loadAudio(): void {
    for (const key of Object.keys(Assets.Audio)) {
      const asset = Assets.Audio[key];
      const types = Object.getOwnPropertyNames(asset).filter(
        (method) => asset[method] instanceof Function && method !== "getName"
      );
      for (const type of types) {
        this.loader.audio(asset.getName(), asset[type]());
      }
    }
  }

  private static loadAudiosprites(): void {
    for (const key of Object.keys(Assets.Audiosprites)) {
      const asset = Assets.Audiosprites[key];
      const types = Object.getOwnPropertyNames(asset).filter(
        (method) => asset[method] instanceof Function && method !== "getName"
      );
      const audio: Array<string> = [];
      for (const type of types) {
        if (!`${asset[type]}`.endsWith("json")) {
          audio.push(asset[type]());
        }
      }
      this.loader.audioSprite(asset.getName(), asset.getJSON(), audio);
    }
  }

  private static loadBitmapFonts(): void {
    for (const key of Object.keys(Assets.BitmapFonts)) {
      const asset = Assets.BitmapFonts[key];
      const types = Object.getOwnPropertyNames(asset).filter(
        (method) => asset[method] instanceof Function && method !== "getName"
      );

      const texture: Array<string> = [];

      for (const type of types) {
        const path = asset[type]();
        if (!`${path}`.endsWith("fnt")) {
          texture.push(path);
        }
      }

      this.loader.bitmapFont(asset.getName(), texture, asset.getFNT());
    }
  }

  private static loadJSON(): void {
    for (const key of Object.keys(Assets.JSON)) {
      const asset = Assets.JSON[key];
      this.loader.json(asset.getName(), asset.getJSON());
    }
  }

  private static loadXML(): void {
    for (const key of Object.keys(Assets.XML)) {
      const asset = Assets.XML[key];
      this.loader.xml(asset.getName(), asset.getXML());
    }
  }

  private static loadText(): void {
    for (const key of Object.keys(Assets.Text)) {
      const asset = Assets.Text[key];
      this.loader.text(asset.getName(), asset.getTXT());
    }
  }

  private static loadScripts(): void {
    for (const key of Object.keys(Assets.Scripts)) {
      const asset = Assets.Scripts[key];
      this.loader.script(asset.getName(), asset.getJS());
    }
  }

  private static loadShaders(): void {
    for (const key of Object.keys(Assets.Shaders)) {
      const asset = Assets.Shaders[key];
      this.loader.glsl(asset.getName(), asset.getFRAG());
    }
  }

  public static loadAllAssets(loader: Phaser.Loader.LoaderPlugin): void {
    this.loader = loader;
    this.loadImages();
    this.loadSpritesheets();
    this.loadAtlases();
    this.loadAudio();
    this.loadAudiosprites();
    this.loadBitmapFonts();
    this.loadJSON();
    this.loadXML();
    this.loadText();
    this.loadScripts();
    this.loadShaders();
    this.loader.start();
  }
}
