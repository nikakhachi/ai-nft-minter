import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { useContext } from "react";

const WalletNotConnected = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  return (
    <button
      onClick={nftCollectionContext?.connectToWallet}
      type="submit"
      className="m-auto mt-10 w-96 border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center h-10"
    >
      Connect the Wallet
    </button>
  );
};

export default WalletNotConnected;
