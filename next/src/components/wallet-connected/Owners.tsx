import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { CircularProgress } from "@mui/material";
import { useContext } from "react";

const Owners = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  const ownerCount = () => {
    if (nftCollectionContext?.areNftsLoading) return undefined;
    if (nftCollectionContext) return Object.keys(nftCollectionContext.nftOwners).length;
  };

  return (
    <>
      <p className="text-white text-3xl text-center mb-10">Owners {!nftCollectionContext?.areNftsLoading && `- ${ownerCount()}`}</p>
      {nftCollectionContext?.areNftsLoading ? (
        <div className="flex align-center justify-center w-full mt-10">
          <CircularProgress color="error" />
        </div>
      ) : (
        <div className="text-white w-full text-center px-2">
          {nftCollectionContext &&
            Object.keys(nftCollectionContext?.nftOwners).map((item) => (
              <p className="my-1">
                <span className="font-semibold text-white dark:text-white text-md mdtext-xl">{item}</span> minted{" "}
                <span className="font-semibold text-white dark:text-white text-md mdtext-xl">{nftCollectionContext.nftOwners[item]}</span>{" "}
                NFTs
              </p>
            ))}
        </div>
      )}
    </>
  );
};

export default Owners;
