export interface ResponsePrintInterface {
  output?: string | null;
  outputFormat: string;
  showLabels?: boolean;
}

export interface ResponseDecoratorInterface {
  output: string;
  showLabels?: boolean;
}
