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

export type TextSize =
  | "xsmall"
  | "small"
  | "large"
  | "normal"
  | "xlarge"
  | null;
