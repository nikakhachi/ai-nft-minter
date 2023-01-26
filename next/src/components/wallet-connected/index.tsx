import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { useContext, useEffect } from "react";
import AllMintedNfts from "./AllMintedNfts";
import MintNft from "./MintNft";
import Owners from "./Owners";

const WalletConnected = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  useEffect(() => {
    nftCollectionContext?.fetchDataFromContract();
    nftCollectionContext?.setEventHandlers();
  }, []);

  return (
    <>
      <MintNft />
      <AllMintedNfts />
      <Owners />
    </>
  );
};

export default WalletConnected;
