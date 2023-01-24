import { CONTRACT_ADDRESS } from "@/constants";
import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { shortenAddress } from "@/utils";
import { CircularProgress, Switch, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";

const AllMintedNfts = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  const [toggleUserNfts, setToggleUserNfts] = useState(false);

  useEffect(() => {
    nftCollectionContext?.fetchAllNfts();
  }, []);

  return (
    <>
      <div className="text-center mt-10 mb-5">
        <p className="text-white text-3xl ">NFTs Minted</p>
        <div className="flex justify-center items-center mt-2">
          <Switch color="error" onChange={(e) => setToggleUserNfts(e.target.checked)} checked={toggleUserNfts} />
          <p className="text-white text-lg">Only My NFTs</p>
        </div>
      </div>
      <div className="container flex flex-wrap mx-auto pb-20 gap-y-5">
        {nftCollectionContext?.areNftsLoading ? (
          <div className="flex align-center justify-center w-full mt-10">
            <CircularProgress color="error" />
          </div>
        ) : (
          (!toggleUserNfts ? nftCollectionContext?.allNfts || [] : nftCollectionContext?.userNfts || []).map((item, index) => (
            <div key={item.id} className="w-1/2 p-2 rounded lg:w-1/4 md:w-1/3">
              <a href={`https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}/${index}`} target="_blank" rel="noreferrer">
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
          ))
        )}
      </div>
    </>
  );
};

export default AllMintedNfts;
