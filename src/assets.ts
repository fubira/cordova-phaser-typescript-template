/* AUTO GENERATED FILE. DO NOT MODIFY. YOU WILL LOSE YOUR CHANGES ON BUILD. */

export namespace Images {
  const ImagesLogo2PNG = require("assets/images/logo2.png").default;
  const ImagesProgressBarPNG = require("assets/images/progress_bar.png").default;
  const ImagesProgressFramePNG = require("assets/images/progress_frame.png").default;
  export class ImagesLogo2 {
    static getName(): string { return "logo2"; }
    static getPNG(): string { return ImagesLogo2PNG; }
  }
  export class ImagesProgressBar {
    static getName(): string { return "progress_bar"; }
    static getPNG(): string { return ImagesProgressBarPNG; }
  }
  export class ImagesProgressFrame {
    static getName(): string { return "progress_frame"; }
    static getPNG(): string { return ImagesProgressFramePNG; }
  }
}

export namespace Spritesheets {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Atlases {
  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Audio {
  const AudioBgmMP3 = require("assets/audio/bgm.mp3").default;
  const AudioBgmOGG = require("assets/audio/bgm.ogg").default;
  export class AudioBgm {
    static getName(): string { return "bgm"; }
    static getMP3(): string { return AudioBgmMP3; }
    static getOGG(): string { return AudioBgmOGG; }
  }
}

export namespace Audiosprites {
  const AudiospritesSoundAC3 = require("assets/audiosprites/sound.ac3").default;
  const AudiospritesSoundJSON = require("assets/audiosprites/sound.json").default;
  const AudiospritesSoundM4A = require("assets/audiosprites/sound.m4a").default;
  const AudiospritesSoundMP3 = require("assets/audiosprites/sound.mp3").default;
  const AudiospritesSoundOGG = require("assets/audiosprites/sound.ogg").default;

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
    static getAC3(): string { return AudiospritesSoundAC3; }
    static getJSON(): string { return AudiospritesSoundJSON; }
    static getM4A(): string { return AudiospritesSoundM4A; }
    static getMP3(): string { return AudiospritesSoundMP3; }
    static getOGG(): string { return AudiospritesSoundOGG; }

    static Sprites = AudiospritesSoundSprites
  }
}

export namespace CustomWebFonts {
  const FontsK8X12CSS = require("!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/k8x12.css").default;
  const FontsK8X12TTF = require("!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/k8x12.ttf").default;
  export class FontsK8X12 {
    static getName(): string { return "k8x12"; }
    static getFamily(): string { return "k8x12"; }
    static getCSS(): string { return FontsK8X12CSS; }
    static getTTF(): string { return FontsK8X12TTF; }
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

