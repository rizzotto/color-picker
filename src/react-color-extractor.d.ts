declare module "react-color-extractor" {
  import { Component, ReactNode } from "react";

  export interface ColorExtractorProps {
    getColors: (colors: string[]) => void;
    children: ReactNode;
  }

  export class ColorExtractor extends Component<ColorExtractorProps> {}
}
