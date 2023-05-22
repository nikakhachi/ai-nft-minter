import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useContext } from "react";
import { NFTCollectionContext, NftType } from "@/contexts/NFTCollectionContext";
import NavBar from "@/components/NavBar";
import WalletNotConnected from "@/components/wallet-not-connected";
import WalletConnected from "@/components/wallet-connected";
import Loading from "@/components/Loading";
import IncorrectNetwork from "@/components/IncorrectNetwork";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { jsonRpsServices } from "@/services/jsonRpc.service";
import { ipfsUriToUrl } from "@/utils";
import axios from "axios";

export default function Home({ nfts }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

export const getServerSideProps: GetServerSideProps<{
  nfts: NftType[];
}> = async () => {
  const nftsRes = await jsonRpsServices.fetchNfts();
  const nfts: NftType[] = await Promise.all(
    nftsRes.map((item) =>
      axios.get(ipfsUriToUrl(item.uri)).then(({ data: metadata }) => {
        return {
          name: metadata.name,
          description: metadata.description,
          owner: item.owner,
          id: item.id,
          imageUrl: ipfsUriToUrl(metadata.image),
        };
      })
    )
  );
  return { props: { nfts } };
};
