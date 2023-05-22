import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { CircularProgress } from "@mui/material";
import { useContext } from "react";

const Owners = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  const ownerCount = () => {
    if (nftCollectionContext?.areNftsLoading) return undefined;
    if (nftCollectionContext) return Object.keys(nftCollectionContext.nftOwners).length;
  };

  const owners = nftCollectionContext
    ? Object.keys(nftCollectionContext?.nftOwners).map((item) => ({ address: item, count: nftCollectionContext.nftOwners[item] }))
    : [];

  return (
    <>
      <p className="text-white text-3xl text-center mb-10">Owners {!nftCollectionContext?.areNftsLoading && `- ${ownerCount()}`}</p>
      <div className="text-white w-full text-center px-2">
        {owners
          .sort((a, b) => b.count - a.count)
          .map((item) => (
            <p className="my-1" key={item.address}>
              <span className="font-semibold text-white dark:text-white text-md mdtext-xl">{item.address}</span> minted{" "}
              <span className="font-semibold text-white dark:text-white text-md mdtext-xl">{item.count}</span> NFTs
            </p>
          ))}
      </div>
    </>
  );
};

export default Owners;
