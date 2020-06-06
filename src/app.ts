import * as Phaser from "phaser";
import BootScene from "@/scenes/BootScene";
import PreloadScene from "@/scenes/PreloadScene";
import TitleScene from "@/scenes/TitleScene";

export default class App extends Phaser.Game {
  public static start(): App {
    const gameWidth: number = GAME_WIDTH;
    const gameHeight: number = GAME_HEIGHT;
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: true,
      },
      width: gameWidth,
      height: gameHeight,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      parent: "",
      resolution: 1,
    };
    return new App(gameConfig);
  }

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
    this.scene.add("BootScene", BootScene);
    this.scene.add("PreloadScene", PreloadScene);
    this.scene.add("TitleScene", TitleScene);
    this.scene.start("BootScene");
  }
}
