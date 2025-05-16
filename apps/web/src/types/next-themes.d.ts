// apps/web/src/types/next-themes.d.ts

declare module "next-themes" {
  import * as React from "react";

  export interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    forcedTheme?: string;
    disableTransitionOnChange?: boolean;
    value?: {
      [themeName: string]: string;
    };
    themes?: string[];
    storageKey?: string;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;

  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    systemTheme: string | undefined;
    resolvedTheme: string | undefined;
  };
}
