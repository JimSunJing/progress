import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ThemeProvider attribute="class">
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </ThemeProvider>
    </RecoilRoot>
  );
}
