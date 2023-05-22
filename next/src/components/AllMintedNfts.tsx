import { CONTRACT_ADDRESS } from "@/constants";
import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { shortenAddress } from "@/utils";
import { CircularProgress, Switch, Tooltip } from "@mui/material";
import { useContext, useState } from "react";

const AllMintedNfts = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  const [toggleUserNfts, setToggleUserNfts] = useState(false);

  return (
    <>
      <div className="text-center mt-10 mb-1">
        <p className="text-white text-3xl ">NFT Collection</p>
        <p className="text-xl text-gray-400">
          {nftCollectionContext?.totalSupply} minted out of {nftCollectionContext?.maxSupply}
        </p>
        <div className="container flex flex-wrap justify-end mx-auto">
          <Switch color="error" onChange={(e) => setToggleUserNfts(e.target.checked)} checked={toggleUserNfts} />
          <p className="text-white text-lg mr-2">Only My NFTs</p>
        </div>
      </div>
      <div className="container flex flex-wrap mx-auto pb-20 gap-y-5">
        {(!toggleUserNfts ? nftCollectionContext?.allNfts || [] : nftCollectionContext?.userNfts || [])
          .sort((a, b) => b.id - a.id)
          .map((item) => (
            <div key={item.id} className="w-1/2 p-2 rounded lg:w-1/4 md:w-1/3">
              <a href={`https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}/${item.id}`} target="_blank" rel="noreferrer">
                <img src={item.imageUrl} alt="image" />
              </a>
              <p className="text-white mt-2">
                <strong>NAME: </strong>
                {item.name}
              </p>
              <p className="text-white">
                <strong>DESCRIPTION: </strong>
                {item.description}
              </p>
              <Tooltip title={item.owner}>
                <p className="text-white">
                  <strong>OWNER: </strong>
                  <span>{shortenAddress(item.owner)}</span>
                </p>
              </Tooltip>
            </div>
          ))}
      </div>
    </>
  );
};

export default AllMintedNfts;
