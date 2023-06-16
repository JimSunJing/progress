import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Head>
        <title>PROGRESS VIEW</title>
        <meta
          name="description"
          content="Progress Tracking 🌈 Visualize Data "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider attribute="class">
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </ThemeProvider>
    </RecoilRoot>
  );
}
