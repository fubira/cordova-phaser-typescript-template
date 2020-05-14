import { ThemeStyles, TextSize } from "./Types";

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

  public getTextSize(size: TextSize): number {
    switch (size) {
      case "xsmall":
        return this.styles.textSizeXSmall || 12;
      case "small":
        return this.styles.textSizeSmall || this.getTextSize("xsmall");
      case "normal":
        return this.styles.textSizeNormal || this.getTextSize("small");
      case "large":
        return this.styles.textSizeLarge || this.getTextSize("normal");
      case "xlarge":
        return this.styles.textSizeXLarge || this.getTextSize("large");
      default:
        break;
    }
    return Number.parseInt(size, 10) || this.getTextSize("normal");
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
