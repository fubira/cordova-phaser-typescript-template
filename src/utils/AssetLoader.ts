import * as Assets from "../assets";

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
      Object.keys(asset).map((method) => {
        console.log(asset[method]);
        if (asset[method] instanceof String) {
          this.loader.image(asset.getName(), asset[method]);
        }
      });
    }
  }

  private static loadSpritesheets(): void {
    for (const key of Object.keys(Assets.Spritesheets)) {
      const asset = Assets.Spritesheets[key];

      Object.keys(asset).map((method) => {
        console.log(asset[method]);
        if (asset[method] instanceof String) {
          this.loader.spritesheet(asset.getName(), asset[method], {
            frameWidth: asset.getFrameWidth(),
            frameHeight: asset.getFrameHeight(),
            startFrame: 0,
            endFrame: asset.getFrameMax(),
            margin: asset.getMargin(),
            spacing: asset.getSpacing(),
          });
        }
      });
    }
  }

  private static loadAtlases(): void {
    for (const key of Object.keys(Assets.Atlases)) {
      const asset = Assets.Atlases[key];

      Object.keys(asset).map((method) => {
        console.log(asset[method]);
        if (asset[method] instanceof String) {
          this.loader.atlas(asset.getName(), asset[method]);
        }
      });
    }
  }

  private static loadAudio(): void {
    for (const key of Object.keys(Assets.Audio)) {
      const asset = Assets.Audio[key];

      Object.keys(asset).map((method) => {
        console.log(asset[method]);
        if (asset[method] instanceof String) {
          this.loader.audio(asset.getName(), asset[method]);
        }
      });
    }
  }

  private static loadAudiosprites(): void {
    for (const key of Object.keys(Assets.Audiosprites)) {
      const asset = Assets.Audiosprites[key];

      Object.keys(asset).map((method) => {
        console.log(asset[method]);
        const audio: Array<string> = [];

        if (asset[method] instanceof String) {
          if (!`${asset[method]}`.endsWith("json")) {
            audio.push(asset[method]);
          }
        }
        this.loader.audioSprite(asset.getName(), asset.getJSON(), audio);
      });
    }
  }

  private static loadBitmapFonts(): void {
    for (const key of Object.keys(Assets.Audiosprites)) {
      const asset = Assets.Audiosprites[key];

      Object.keys(asset).map((method) => {
        console.log(asset[method]);
        const texture: Array<string> = [];

        if (asset[method] instanceof String) {
          if (!`${asset[method]}`.endsWith("fnt")) {
            texture.push(asset[method]);
          }
        }
        this.loader.bitmapFont(asset.getName(), texture, asset.getFNT());
      });
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

  public static loadAllAssets(
    loader: Phaser.Loader.LoaderPlugin
  ): Promise<void> {
    this.loader = loader;

    return new Promise((resolve) => {
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

      this.loader.on("complete", () => {
        resolve();
      });
    });
  }
}
