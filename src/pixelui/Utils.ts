import * as PixelUI from ".";

/**
 * Calculates the height of a string when rendering in the specified style.
 * @param scene Phaser.Scene
 * @param text text string[s]
 * @param style PixelUI.TextLabelStyle
 */
export function calcTextHeight(
  scene: Phaser.Scene,
  text: string | string[],
  style: PixelUI.TextLabelStyle
): number {
  const textObject = PixelUI.add.textLabel(scene, 0, 0, text, style);
  const height = textObject.height;
  textObject.destroy();
  return height;
}
