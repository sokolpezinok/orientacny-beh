# Orientačný beh

Aplikácia na zjednodušenie prihlasovania na preteky zo stránky:
https://members.eob.cz/

## Gallery

<img src="./images/1_list.png" width="30%"></img> <img src="./images/2_detail.png" width="30%"></img> <img src="./images/3_notify.png" width="30%"></img>

## Inštalácia

```sh
git clone https://github.com/sokolpezinok/orientacny-beh
cd orientacny-beh
pnpm i
```

## Development

**Starts the Vite development server.**

```sh
pnpm run dev
```

**Builds the production version using Vite.**

```sh
pnpm run build
```

**Previews the production build locally.**

```sh
pnpm run preview
```

**Builds the project and outputs in `dist/`**

```sh
pnpm run build:android
```

**Syncs Capacitor and opens the Android project in Android Studio.**

```sh
pnpm run android:open
```

**Cleans android cache**

```sh
pnpm run android:clean
```

## Tests & Linting

**Runs `i18n` tests**

```sh
pnpm run test:i18n
```

**Runs eslint**

```sh
pnpm run lint
```

## Build

**Android Release Checklist**

1. Increase `versionCode` and `versionName` in `android/variables.gradle`, increase `appBuildVersion` in `src/manifest`
2. Build the app

```sh
pnpm run android:build
```

3. Sign it

## Extensions & Environment

We use [VS Code](https://code.visualstudio.com/) with following extensions:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [Slovak - Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-slovak)
  - [Czech - Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-czech)

## Licencia

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
