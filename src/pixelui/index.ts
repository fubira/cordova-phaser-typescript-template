/**
 * PixelUI global theme
 */
import { Theme } from "./Theme";
export { ThemeStyles } from "./Theme";
export const theme = new Theme();

/**
 * PixelUI component factory
 */
import { TextLabelFactory } from "./component/TextLabel";
import { BackgroundFactory } from "./component/Background";
import { LoadingProgressFactory } from "./component/LoadingProgress";
import { DialogFactory } from "./component/Dialog";
import { ButtonFactory } from "./component/Button";

export const add = {
  textLabel: TextLabelFactory,
  background: BackgroundFactory,
  loadingProgerss: LoadingProgressFactory,
  dialog: DialogFactory,
  button: ButtonFactory,
};

/**
 * PixelUI component class and styles
 */
export { LoadingProgress } from "./component/LoadingProgress";
export { TextLabel, TextLabelStyle } from "./component/TextLabel";
export { Dialog, DialogStyle } from "./component/Dialog";
export { Button, ButtonStyle } from "./component/Button";

/**
 * PixelUI types
 */
export * from "./Types";
