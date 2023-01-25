import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { useContext, useEffect } from "react";
import AllMintedNfts from "./AllMintedNfts";
import MintNft from "./MintNft";

const WalletConnected = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  useEffect(() => {
    nftCollectionContext?.fetchDataFromContract();
  }, []);

  return (
    <>
      <MintNft />
      <AllMintedNfts />
    </>
  );
};

export default WalletConnected;
