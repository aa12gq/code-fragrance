declare module "escomplex" {
  interface ComplexityAnalysis {
    aggregate: {
      cyclomatic: number;
      [key: string]: any;
    };
  }

  export function analyse(code: string): ComplexityAnalysis;
}
