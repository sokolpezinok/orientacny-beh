import Head from "next/head";
import { Inter } from "next/font/google";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";

import "../styles/global.css";
import "../styles/theme.css";
import "../styles/ionic.css";

import { appName } from "@/manifest";

import classNames from "classnames";

const font = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--ion-font-family",
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={classNames(font.className, font.variable)}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"></meta>
        <title>{appName}</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
