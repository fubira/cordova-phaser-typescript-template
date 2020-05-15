import { TextLabelFactory } from "./component/TextLabel";
import { BackgroundFactory } from "./component/Background";
import { LoadingProgressFactory } from "./component/LoadingProgress";
import { DialogFactory } from "./component/Dialog";

export class Factory {
  public textLabel = TextLabelFactory;
  public background = BackgroundFactory;
  public loadingProgerss = LoadingProgressFactory;
  public dialog = DialogFactory;
}
