import { NFTCollectionProvider } from "@/contexts/NFTCollectionContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NFTCollectionProvider>
      <Component {...pageProps} />
    </NFTCollectionProvider>
  );
}
