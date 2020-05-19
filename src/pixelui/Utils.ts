import * as PixelUI from ".";

/**
 * Convert a color specified by a string or number to Phaser.Display.Color.
 * @param value Color value ("#000000" or 0x000000)
 * @param defValue The default value to use if value is invalid
 */
export function valueToColor(
  value: string | number,
  defValue: string | number = 0x000000
): Phaser.Display.Color {
  return Phaser.Display.Color.ValueToColor(value || defValue || 0);
}

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
