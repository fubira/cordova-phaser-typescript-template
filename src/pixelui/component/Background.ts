import * as PixelUI from "../";
import * as Utils from "../Utils";

export interface BackgroundStyle {
  /**
   * Background fill color
   */
  fillColor?: string;
  /**
   * Background alpha
   */
  fillAlpha?: number;
  /**
   * Texture image name
   */
  texture?: string;
}

/**
 * A background image component that displays a theme color or texture
 * image at the far end of the screen.
 *
 * @param scene Phaser.Scene
 * @param style Specifying the background style
 */
export function BackgroundFactory(
  scene: Phaser.Scene,
  style: BackgroundStyle
): Phaser.GameObjects.Rectangle {
  const fillColor = style.fillColor || PixelUI.theme.backgroundColor();
  const texture = style.texture;
  const fillAlpha = style.texture
    ? style.fillAlpha || 0.5
    : style.fillAlpha || 1.0;
  const centerX = scene.cameras.main.centerX;
  const centerY = scene.cameras.main.centerY;

  if (texture) {
    scene.add.sprite(centerX, centerY, texture);
  }

  scene.cameras.main.setBackgroundColor(fillColor);

  return scene.add.rectangle(
    centerX,
    centerY,
    GAME_WIDTH,
    GAME_HEIGHT,
    Utils.valueToColor(fillColor).color,
    fillAlpha
  );
}
