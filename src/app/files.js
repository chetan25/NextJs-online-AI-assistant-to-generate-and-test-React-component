/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  src: {
    // Because it's a directory, add the "directory" key
    directory: {
      "main.css": {
        file: {
          contents: `
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
          `,
        },
      },
    },
  },
  // This is a file outside the folder
  "package.json": {
    file: {
      contents: `
      {
        "name": "live-renderer",
        "private": true,
        "version": "0.0.0",
        "type": "module",
        "scripts": {
          "start": "vite",
          "build": "vite build",
          "lint": "eslint .",
          "preview": "vite preview"
        },
        "dependencies": {
          "react": "^18.3.1",
          "react-dom": "^18.3.1"
        },
        "devDependencies": {
          "@eslint/js": "^9.13.0",
          "@types/react": "^18.3.11",
          "@types/react-dom": "^18.3.1",
          "@vitejs/plugin-react": "^4.3.3",
          "eslint": "^9.13.0",
           "autoprefixer": "^10.4.20",
          "eslint-plugin-react": "^7.37.1",
          "eslint-plugin-react-hooks": "^5.0.0",
          "eslint-plugin-react-refresh": "^0.4.13",
          "globals": "^15.11.0",
          "postcss": "^8.4.47",
          "tailwindcss": "^3.4.14",
          "vite": "^5.4.9"
        }
      }     
      `,
    },
  },
  "index.html": {
    file: {
      contents: `
      <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Vite + React</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.jsx"></script>
          </body>
        </html>
      `,
    },
  },
  "vite.config.js": {
    file: {
      contents: `
          import { defineConfig } from 'vite'
          import react from '@vitejs/plugin-react'

          // https://vite.dev/config/
          export default defineConfig({
            plugins: [react()],
          })
      `,
    },
  },
  "tailwind.config.js": {
    file: {
      contents: `
        /** @type {import('tailwindcss').Config} */
        export default {
          content: [
             "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
         ],
          theme: {
            extend: {},
          },
          plugins: [],
        }
      `,
    },
  },
  "eslint.config.js": {
    file: {
      contents: `
          import js from '@eslint/js'
          import globals from 'globals'
          import react from 'eslint-plugin-react'
          import reactHooks from 'eslint-plugin-react-hooks'
          import reactRefresh from 'eslint-plugin-react-refresh'

          export default [
            { ignores: ['dist'] },
            {
              files: ['**/*.{js,jsx}'],
              languageOptions: {
                ecmaVersion: 2020,
                globals: globals.browser,
                parserOptions: {
                  ecmaVersion: 'latest',
                  ecmaFeatures: { jsx: true },
                  sourceType: 'module',
                },
              },
              settings: { react: { version: '18.3' } },
              plugins: {
                react,
                'react-hooks': reactHooks,
                'react-refresh': reactRefresh,
              },
              rules: {
                ...js.configs.recommended.rules,
                ...react.configs.recommended.rules,
                ...react.configs['jsx-runtime'].rules,
                ...reactHooks.configs.recommended.rules,
                'react/jsx-no-target-blank': 'off',
                'react-refresh/only-export-components': [
                  'warn',
                  { allowConstantExport: true },
                ],
              },
            },
          ]

      `,
    },
  },
  "postcss.config.js": {
    file: {
      contents: `
            export default {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          }
        `,
    },
  },
};
