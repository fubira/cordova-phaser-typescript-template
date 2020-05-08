/* AUTO GENERATED FILE. DO NOT MODIFY. YOU WILL LOSE YOUR CHANGES ON BUILD. */

export namespace Images {
  const ImagesLogo2PNG = require("assets/images/logo2.png");
  const ImagesProgressBarPNG = require("assets/images/progress_bar.png");
  const ImagesProgressFramePNG = require("assets/images/progress_frame.png");
  export class ImagesLogo2 {
    static getName(): string { return "logo2"; }
    static getPNG(): string { return ImagesLogo2PNG.default; }
  }
  export class ImagesProgressBar {
    static getName(): string { return "progress_bar"; }
    static getPNG(): string { return ImagesProgressBarPNG.default; }
  }
  export class ImagesProgressFrame {
    static getName(): string { return "progress_frame"; }
    static getPNG(): string { return ImagesProgressFramePNG.default; }
  }
}

export namespace Spritesheets {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Atlases {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Audio {
  const AudioBgmMP3 = require("assets/audio/bgm.mp3");
  const AudioBgmOGG = require("assets/audio/bgm.ogg");
  export class AudioBgm {
    static getName(): string { return "bgm"; }
    static getMP3(): string { return AudioBgmMP3.default; }
    static getOGG(): string { return AudioBgmOGG.default; }
  }
}

export namespace Audiosprites {
  const AudiospritesSoundAC3 = require("assets/audiosprites/sound.ac3");
  const AudiospritesSoundJSON = require("assets/audiosprites/sound.json");
  const AudiospritesSoundM4A = require("assets/audiosprites/sound.m4a");
  const AudiospritesSoundMP3 = require("assets/audiosprites/sound.mp3");
  const AudiospritesSoundOGG = require("assets/audiosprites/sound.ogg");

  enum AudiospritesSoundSprites {
    SeButtonOver = <any>'se_button_over',
    SeFailure = <any>'se_failure',
    SeGameOver = <any>'se_game_over',
    SeLaser1 = <any>'se_laser_1',
    SeLaser2 = <any>'se_laser_2',
    SeMechPress1 = <any>'se_mech_press1',
    SeMechPress2 = <any>'se_mech_press2',
    SeMetalHit1 = <any>'se_metal_hit1',
    SeMetalHit2 = <any>'se_metal_hit2',
    SeSelect = <any>'se_select',
    SeShotB1 = <any>'se_shot_b1',
    SeShotB2 = <any>'se_shot_b2',
    SeShotP1 = <any>'se_shot_p1',
    SeShotPd1 = <any>'se_shot_pd1',
    SeShotPd2 = <any>'se_shot_pd2',
    SeShotPd3 = <any>'se_shot_pd3',
    SeShotZ1 = <any>'se_shot_z1',
    SeShotZ2 = <any>'se_shot_z2',
    SeShotZ3 = <any>'se_shot_z3',
    SeShotZ4 = <any>'se_shot_z4',
    SeShotZ5 = <any>'se_shot_z5',
    SeShotZs1 = <any>'se_shot_zs1',
    SeShotZs2 = <any>'se_shot_zs2',
  }

  export class AudiospritesSound {
    static getName(): string { return "sound"; }
    static getAC3(): string { return AudiospritesSoundAC3.default; }
    static getJSON(): string { return AudiospritesSoundJSON.default; }
    static getM4A(): string { return AudiospritesSoundM4A.default; }
    static getMP3(): string { return AudiospritesSoundMP3.default; }
    static getOGG(): string { return AudiospritesSoundOGG.default; }

    static Sprites = AudiospritesSoundSprites
  }
}

export namespace CustomWebFonts {
  const FontsK8X12CSS = require("!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/k8x12.css");
  const FontsK8X12TTF = require("!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/k8x12.ttf");
  export class FontsK8X12 {
    static getName(): string { return "k8x12"; }
    static getFamily(): string { return "k8x12"; }
    static getCSS(): string { return FontsK8X12CSS.default; }
    static getTTF(): string { return FontsK8X12TTF.default; }
  }
}

export namespace BitmapFonts {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace JSON {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Text {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Scripts {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Shaders {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

