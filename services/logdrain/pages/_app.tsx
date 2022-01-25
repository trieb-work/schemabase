import type { AppProps } from "next/app";
import { CssBaseline, GeistProvider } from "@geist-ui/react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
