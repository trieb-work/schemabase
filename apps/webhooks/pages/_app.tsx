import { AppProps } from "next/app";
import Head from "next/head";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to webhooks!</title>
      </Head>
      <div>
        <header>
          <h1>Welcome to webhooks!</h1>
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default CustomApp;
