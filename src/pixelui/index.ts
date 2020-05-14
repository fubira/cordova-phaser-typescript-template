import { Factory } from "./Factory";
import { Theme } from "./Theme";

export { ThemeOptions } from "./Theme";
export { LoaderProgress } from "./component/LoaderProgress";
export { LabelTextSize } from "./component/TextLabel";

export class PixelUI {
  public static theme = new Theme();
  public static add = new Factory();
}
