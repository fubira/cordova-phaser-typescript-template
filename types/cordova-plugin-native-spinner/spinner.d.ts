declare class SpinnerDialog {
  public static show(
    title?: string,
    message?: string,
    cancelCallback?: Function,
    iosOptions?: object
  ): void;
  public static hide(success?: Function, fail?: Function): void;
}
