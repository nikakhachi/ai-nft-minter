import { NFTCollectionProvider } from "@/contexts/NFTCollectionContext";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider>
      <NFTCollectionProvider>
        <Component {...pageProps} />
      </NFTCollectionProvider>
    </SnackbarProvider>
  );
}
