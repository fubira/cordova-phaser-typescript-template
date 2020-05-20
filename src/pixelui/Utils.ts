import * as PixelUI from ".";

/**
 * Calculates the range of a string when rendering in the specified style.
 * @param scene Phaser.Scene
 * @param text text string[s]
 * @param style PixelUI.TextLabelStyle
 */
export function calcTextRect(
  scene: Phaser.Scene,
  text: string | string[],
  style: PixelUI.TextLabelStyle
): {
  width: number;
  height: number;
} {
  const textObject = PixelUI.add.textLabel(scene, 0, 0, text, style);
  const width = textObject.width;
  const height = textObject.height;
  textObject.destroy();
  return { width, height };
}
