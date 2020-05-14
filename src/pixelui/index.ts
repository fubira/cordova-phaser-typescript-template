import { Factory } from "./Factory";
import { Theme } from "./Theme";

export { ThemeStyles } from "./Theme";
export { LoaderProgress } from "./component/LoaderProgress";

export class PixelUI {
  public static theme = new Theme();
  public static add = new Factory();
}
