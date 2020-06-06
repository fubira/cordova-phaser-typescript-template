import * as PixelUI from "..";

export class DebugInfo extends Phaser.GameObjects.Container {
  label: Phaser.GameObjects.Text;
  lastUpdatedAt = 0;
  text: string | string[];

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, []);

    this.label = scene.add.text(0, 0, [], {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000",
        blur: 2,
        fill: true,
      },
    });
    this.add(this.label);
    this.setDepth(1);
  }

  public setText(text: string | string[]): void {
    this.text = text;
  }

  public update(): void {
    const now = this.scene.time.now;
    if (this.lastUpdatedAt + 1000 < now) {
      this.lastUpdatedAt = now;
      const info = this.getDebugInfoText();
      this.label.setText(info);
    }
  }

  private getDebugInfoText(): string[] {
    const game = this.scene.game;
    const fps = {
      actual: game.loop.actualFps.toFixed(1),
      target: game.loop.targetFps.toFixed(1),
    };
    const info = [
      `Device: ${this.getDeviceOS()} ${this.getDeviceBrowser()}`,
      `Features: ${this.getFeatures()}`,
      `Resolution: ${this.getGameResolution()}`,
      `Display: ${this.getDisplayResolution()}`,
      `FPS: ${fps.actual} / ${fps.target}`,
      ``,
    ];

    let append;
    if (this.text instanceof Array) {
      append = this.text;
    } else {
      append = [this.text];
    }
    info.push(...append);
    return info;
  }

  private getGameResolution(): string {
    const game = this.scene.game.scale.gameSize;
    return `[${game.width.toFixed(0)}, ${game.height.toFixed(0)}]`;
  }

  private getDisplayResolution(): string {
    const display = this.scene.game.scale.displaySize;
    const fullscreen = this.scene.game.scale.isFullscreen ? " Fullscreen" : "";

    return (
      `[${display.width.toFixed(0)}, ${display.height.toFixed(0)}]` + fullscreen
    );
  }

  private getDeviceOS(): string {
    const result = [];
    const device = this.scene.game.device;
    if (device.os.android) {
      result.push("Android");
    }
    if (device.os.iOS) {
      result.push("iOS", device.os.iOSVersion);
    }
    if (device.os.windows) {
      result.push("Windows");
    }
    if (device.os.macOS) {
      result.push("MacOS");
    }
    if (device.os.linux) {
      result.push("Linux");
    }
    if (device.os.chromeOS) {
      result.push("ChromeOS");
    }

    if (device.os.crosswalk) {
      result.push("Crosswalk");
    }
    if (device.os.electron) {
      result.push("Electron");
    }
    if (device.os.cordova) {
      result.push("Cordova");
    }
    if (device.os.webApp) {
      result.push("WebApp");
    }

    return result.join(" ");
  }

  private getDeviceBrowser(): string {
    const result = [];
    const device = this.scene.game.device;
    if (device.browser.chrome) {
      result.push("Chrome", device.browser.chromeVersion);
    }
    if (device.browser.firefox) {
      result.push("FireFox", device.browser.firefoxVersion);
    }
    if (device.browser.safari) {
      result.push("Safari", device.browser.safariVersion);
    }
    if (device.browser.mobileSafari) {
      result.push("MobileSafari", device.browser.safariVersion);
    }
    if (device.browser.edge) {
      result.push("Edge");
    }
    if (device.browser.ie) {
      result.push("IE", device.browser.ieVersion);
    }
    if (device.browser.opera) {
      result.push("Opera", device.browser.opera);
    }
    if (device.browser.trident) {
      result.push("Trident", device.browser.tridentVersion);
    }
    return result.join(" ");
  }
  private getFeatures(): string {
    const result = [];
    const device = this.scene.game.device;
    if (device.features.canvas) {
      result.push("Canvas");
    }
    if (device.features.canvasBitBltShift) {
      result.push("BitBltSft");
    }
    if (device.features.webGL) {
      result.push("WebGL");
    }
    if (device.features.vibration) {
      result.push("Vibration");
    }
    if (device.audio.webAudio) {
      result.push("WebAudio");
    }
    if (device.audio.dolby) {
      result.push("Dolby");
    }
    return result.join(" ");
  }
}

/**
 * Create a text display component with a common style by theme.
 *
 * @param scene Phaser.Scene
 * @param x Position x
 * @param y Position y
 * @param text Text string[s]
 * @param style Specifying a style
 */
export function DebugInfoFactory(scene: Phaser.Scene): PixelUI.DebugInfo {
  const debugInfo = new DebugInfo(scene);
  scene.children.add(debugInfo);
  return debugInfo;
}
