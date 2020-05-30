import { TextSize } from "./Types";

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

/**
 * PixelUI.Theme
 */
export class Theme {
  private themeStyles: ThemeStyles;

  constructor() {
    this.reset();
  }

  /**
   * Reset to default theme
   */
  public reset(): void {
    this.themeStyles = defaultTheme;
  }

  /**
   * Set theme values
   */
  public update(theme: ThemeStyles): void {
    this.themeStyles = { ...this.themeStyles, ...theme };
  }

  /**
   * Get current theme styles
   */
  public get styles(): ThemeStyles {
    return this.themeStyles;
  }

  /**
   * Get composed theme with global theme and argument theme
   */
  public compose(localTheme: ThemeStyles = {}): ThemeStyles {
    return { ...this.themeStyles, ...localTheme };
  }

  /**
   * Get text size of a number
   * @param size PixelUI.TextSize
   */
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

  /**
   * Get the background color specified by the current theme.
   * @param localTheme PixelUI.ThemeStyles
   */
  public backgroundColor(localTheme?: ThemeStyles): string {
    const color = this.compose(localTheme).themeDark
      ? Phaser.Display.Color.ValueToColor(
          this.compose(localTheme).colorDarkShade
        ).lighten(10)
      : Phaser.Display.Color.ValueToColor(
          this.compose(localTheme).colorLightShade
        ).darken(10);
    return color.rgba;
  }

  /**
   * Get a border color based on the current theme.
   * @param localTheme PixelUI.ThemeStyles
   */
  public borderColor(localTheme?: ThemeStyles): string {
    const color = Phaser.Display.Color.ValueToColor(
      this.compose(localTheme).colorLightShade
    );
    return color.rgba;
  }

  /**
   * Get a border edge color based on the current theme.
   * @param localTheme PixelUI.ThemeStyles
   */
  public borderEdgeColor(localTheme?: ThemeStyles): string {
    const color = Phaser.Display.Color.ValueToColor(
      this.compose(localTheme).colorLightShade
    ).darken(60);
    return color.rgba;
  }

  /**
   * Get a border hover color based on the current theme.
   * @param localTheme PixelUI.ThemeStyles
   */
  public borderHoverColor(localTheme?: ThemeStyles): string {
    const color = this.compose(localTheme).themeDark
      ? Phaser.Display.Color.ValueToColor(
          this.compose(localTheme).colorDarkAccent
        ).lighten(50)
      : Phaser.Display.Color.ValueToColor(
          this.compose(localTheme).colorLightAccent
        );
    return color.rgba;
  }

  /**
   * Get the color of the cover that appears on the back of the dialog.
   * @param localTheme PixelUI.ThemeStyles
   */
  public backdropColor(localTheme?: ThemeStyles): string {
    const color = this.compose(localTheme).colorDarkShade;
    return color || "#000";
  }

  /**
   * Get the text color specified by the current theme.
   * @param localTheme PixelUI.ThemeStyles
   */
  public textColor(localTheme?: ThemeStyles): string {
    const color = this.compose(localTheme).textStroke
      ? this.compose(localTheme).colorLightShade
      : this.compose(localTheme).colorDarkShade;
    return color || "#fff";
  }

  /**
   * Get the text color for header specified by the current theme
   * @param localTheme PixelUI.ThemeStyles
   */
  public textHeaderColor(localTheme?: ThemeStyles): string {
    const color = this.compose(localTheme).textStroke
      ? this.compose(localTheme).colorLightAccent
      : this.compose(localTheme).colorDarkAccent;
    return color || "#ff8";
  }

  /**
   * Get the text stroke coilor specified by the current theme
   * @param localTheme PixelUI.ThemeStyles
   */
  public textStrokeColor(localTheme?: ThemeStyles): string {
    return localTheme ? "#000" : "#000";
  }
}
