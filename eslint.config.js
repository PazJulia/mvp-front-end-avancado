import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      js,
      react: pluginReact
    },
    settings: {
      react: {
        version: "detect" // detecta automaticamente a versão do React
      }
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off" // desativa a regra obsoleta
    }
  },
  tseslint.configs.recommended
]);
