import Head from 'next/head';
import Script from 'next/script';
// import { setupIonicReact } from "@ionic/react";

import { Ubuntu } from 'next/font/google';

// import "tailwindcss/tailwind.css";
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '../styles/global.css';
import '../styles/variables.css';

import classNames from 'classnames';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--ion-font-family',
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={classNames(ubuntu.className, ubuntu.variable)}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"></meta>
        <title>Preteky</title>
      </Head>
      <Component {...pageProps} />
      <Script type="module" src="./scripts/ionicons.esm.js"></Script>
      <Script nomodule="" src="./scripts/ionicons.js"></Script>
    </div>
  );
}

export default MyApp;
