import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useContext } from "react";
import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import NavBar from "@/components/NavBar";
import MintNft from "@/components/MintNft";
import AllMintedNfts from "@/components/AllMintedNfts";

export default function Home() {
  const nftCollectionContext = useContext(NFTCollectionContext);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {nftCollectionContext?.isLoading ? (
          <h1>Loading</h1>
        ) : (
          <>
            <NavBar />
            {nftCollectionContext?.metamaskAccount ? (
              <>
                <MintNft />
                <AllMintedNfts />
              </>
            ) : (
              <button
                onClick={nftCollectionContext?.connectToWallet}
                type="submit"
                className="m-auto mt-10 w-96 border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center h-10"
              >
                Connect the Wallet
              </button>
            )}
          </>
        )}
      </main>
    </>
  );
}
