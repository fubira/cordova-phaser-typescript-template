export interface ThemeStyles {
  themeDark?: boolean;
  textShadow?: boolean;
  textStroke?: boolean;
  textType?: string;

  textFontFamily?: string;
  textSizeXSmall?: number;
  textSizeSmall?: number;
  textSizeNormal?: number;
  textSizeLarge?: number;
  textSizeXLarge?: number;

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

export const defaultTheme: ThemeStyles = {
  textShadow: false,
  textStroke: false,

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

export class Theme {
  private themeStyles: ThemeStyles;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.themeStyles = defaultTheme;
  }

  public update(theme: ThemeStyles): void {
    this.themeStyles = { ...this.themeStyles, ...theme };
  }

  public get styles(): ThemeStyles {
    return this.themeStyles;
  }

  public compose(localTheme: ThemeStyles = {}): ThemeStyles {
    return { ...this.themeStyles, ...localTheme };
  }

  public backgroundColor(localTheme?: ThemeStyles): string {
    const color = this.compose(localTheme).themeDark
      ? this.compose(localTheme).colorDarkShade
      : this.compose(localTheme).colorLightShade;
    return color || "#000";
  }

  public textColor(localTheme?: ThemeStyles): string {
    const color = this.compose(localTheme).textStroke
      ? this.compose(localTheme).colorLightShade
      : this.compose(localTheme).colorDarkShade;
    return color || "#fff";
  }

  public textStrokeColor(): string {
    return "#000";
  }
}
