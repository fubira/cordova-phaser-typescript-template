/**
 * PixelUI global theme
 */
import { Theme } from "./Theme";
export const theme = new Theme();

/**
 * PixelUI component factory
 */
import { TextLabelFactory } from "./component/TextLabel";
import { BackgroundFactory } from "./component/Background";
import { LoadingProgressFactory } from "./component/LoadingProgress";
import { DialogFactory } from "./component/Dialog";

export const add = {
  textLabel: TextLabelFactory,
  background: BackgroundFactory,
  loadingProgerss: LoadingProgressFactory,
  dialog: DialogFactory,
};

/**
 * PixelUI component class and styles
 */
export { LoadingProgress } from "./component/LoadingProgress";
export { Dialog, DialogStyle } from "./component/Dialog";

/**
 * PixelUI types
 */
export * from "./Types";
