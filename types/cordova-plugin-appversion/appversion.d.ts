declare class AppVersion {
  public static version: string;
  public static build: string;
  public static available: boolean;
  public static getInfo(success?: Function, error?: Function);
}
