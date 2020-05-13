export { Background } from "./component/Background";
export { LoaderProgress } from "./component/LoaderProgress";
export { Label, FontSize } from "./component/Label";

export interface ThemeOptions {
  themeDark?: boolean;
  textShadow?: boolean;
  textStroke?: boolean;
  textType?: string;

  textFontFamily?: string;
  textSizeExSmall?: number;
  textSizeSmall?: number;
  textSizeNormal?: number;
  textSizeLarge?: number;
  textSizeExLarge?: number;

  colorMain?: string;
  colorLightShade?: string;
  colorLightAccent?: string;
  colorDarkShade?: string;
  colorDarkAccent?: string;

  colorPrimary?: string;
  colorInfo?: string;
  colorSuccess?: string;
  colorWarning?: string;
  colorDanger?: string;
}

export class PixelUI {
  public static globalTheme: ThemeOptions = {
    themeDark: false,
    textShadow: false,

    colorLightShade: "#F8F6F6",
    colorLightAccent: "#F5A834",
    colorMain: "#9AB6C7",
    colorDarkAccent: "#A95A64",
    colorDarkShade: "#2A344C",

    colorPrimary: "#9ab6c7",
    colorInfo: "#2a344c",
    colorSuccess: "#63b174",
    colorWarning: "#e1a13c",
    colorDanger: "#f44336",
  };

  public static setup(theme: ThemeOptions): void {
    this.globalTheme = { ...this.globalTheme, ...theme };
  }

  public static theme(localTheme: ThemeOptions = {}): ThemeOptions {
    const theme: ThemeOptions = { ...this.globalTheme, ...localTheme };

    if (theme.themeDark) {
      const colorLightShade: string = theme.colorLightShade;
      const colorLightAccent: string = theme.colorLightAccent;
      theme.colorLightShade = theme.colorDarkShade;
      theme.colorLightAccent = theme.colorDarkAccent;
      theme.colorDarkShade = colorLightShade;
      theme.colorDarkAccent = colorLightAccent;
    }
    return theme;
  }
}
