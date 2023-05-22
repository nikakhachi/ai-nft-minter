import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useContext } from "react";
import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import NavBar from "@/components/NavBar";
import WalletNotConnected from "@/components/wallet-not-connected";
import WalletConnected from "@/components/wallet-connected";
import Loading from "@/components/Loading";
import IncorrectNetwork from "@/components/IncorrectNetwork";

export default function Home() {
  const nftCollectionContext = useContext(NFTCollectionContext);

  return (
    <>
      <Head>
        <title>AI-Minted</title>
        <meta name="description" content="Generate images with AI and mint them to own" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <main className={styles.main}>
        {nftCollectionContext?.isLoading ? (
          <Loading />
        ) : (
          <>
            <NavBar />
            {!nftCollectionContext?.metamaskAccount ? (
              <WalletNotConnected />
            ) : nftCollectionContext.isNetworkGoerli === undefined ? (
              <Loading />
            ) : nftCollectionContext.isNetworkGoerli === false ? (
              <IncorrectNetwork />
            ) : (
              <WalletConnected />
            )}
          </>
        )}
      </main>
    </>
  );
}
