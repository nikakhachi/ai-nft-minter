import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { useContext } from "react";

const WalletNotConnected = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  return (
    <div className="container mx-auto md:mt-24 pb-14">
      <div className="flex w-full justify-center flex-col lg:flex-row">
        <div className="flex flex-col items-center justify-center">
          <img src="mona.png" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-white text-xl md:text-3xl font-[Courier]">Connect your Metamask Wallet,</p>
          <p className="text-center text-white text-xl md:text-3xl font-[Courier] my-5 md:my-12">
            Generate an image based on your input with AI,
          </p>
          <p className="text-center text-white text-xl md:text-3xl font-[Courier]">Mint the image as an NFT and own it</p>
          <button
            onClick={nftCollectionContext?.connectToWallet}
            type="submit"
            className="mt-12 w-96 border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center h-10"
          >
            Connect the Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletNotConnected;
