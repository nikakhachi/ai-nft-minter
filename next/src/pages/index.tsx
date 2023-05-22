import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useContext, useEffect } from "react";
import { NFTCollectionContext, NftType } from "@/contexts/NFTCollectionContext";
import NavBar from "@/components/NavBar";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { jsonRpsServices } from "@/services/jsonRpc.service";
import { ipfsUriToUrl } from "@/utils";
import axios from "axios";
import MintNft from "@/components/MintNft";
import AllMintedNfts from "@/components/AllMintedNfts";
import Owners from "@/components/Owners";

export default function Home({ nfts, maxSupply, totalSupply }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const nftCollectionContext = useContext(NFTCollectionContext);

  useEffect(() => {
    nftCollectionContext?.setAllNftsOffline(nfts, maxSupply, totalSupply);
    nftCollectionContext?.setEventHandlers();
  }, []);

  return (
    <>
      <Head>
        <title>AI-Minted</title>
        <meta name="description" content="Generate images with AI and mint them to own" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <main className={styles.main}>
        <NavBar />
        <MintNft />
        <AllMintedNfts />
        <Owners />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  nfts: NftType[];
  maxSupply: number;
  totalSupply: number;
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
  const { maxSupply, totalSupply } = await jsonRpsServices.fetchSupplies();
  return { props: { nfts, maxSupply, totalSupply } };
};
