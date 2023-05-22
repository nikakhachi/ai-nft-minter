import { useContext, useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { CircularProgress } from "@mui/material";
import { SIGNATURE_MESSAGE_1, SIGNATURE_MESSAGE_2 } from "@/constants";
import { SnackbarContext } from "@/contexts/SnackbarContext";

const MintNft = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);
  const snackbarContext = useContext(SnackbarContext);

  const [keyword, setKeyword] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [currentImageMetadata, setCurrentImageMetadata] = useState<{
    blob: Blob;
    uuid: String;
  }>();

  const [isGenerating, setIsGenerating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleGenerateImage = async () => {
    if (!nftCollectionContext?.metamaskAccount) {
      nftCollectionContext?.connectToWallet();
    } else {
      if (!keyword) return snackbarContext?.open("Keyword is empty", "error");
      setIsGenerating(true);
      const uniqueId = uuid();
      try {
        const wallet = nftCollectionContext?.getSigner();
        if (!wallet) return null;
        const signature = await wallet.signMessage(SIGNATURE_MESSAGE_1);
        const res = await axios.post(
          "/api/generate-image",
          {
            keyword,
            uuid: uniqueId,
            msgSender: nftCollectionContext?.metamaskAccount,
            signature,
          },
          {
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([res.data], { type: "image/png" });
        setImage(URL.createObjectURL(blob));
        setCurrentImageMetadata({
          blob,
          uuid: uniqueId,
        });
      } catch (error: any) {
        console.error(error);
        snackbarContext?.open("Something went wrong", "error");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleResetImage = () => {
    setImage(null);
    setCurrentImageMetadata(undefined);
    setKeyword("");
    nftCollectionContext?.setIsMinted(false);
  };

  const handleMint = async () => {
    if (currentImageMetadata) {
      nftCollectionContext?.setIsMinting(true);
      const wallet = nftCollectionContext?.getSigner();
      if (!wallet) return null;
      const signature = await wallet.signMessage(SIGNATURE_MESSAGE_2);
      const { data } = await axios.post("/api/ipfs-upload", {
        uuid: currentImageMetadata?.uuid,
        name,
        description,
        signature,
      });
      nftCollectionContext?.mint(data.ipfsUri);
    }
  };
  return (
    <div className="flex justify-center">
      <div className="w-full  rounded-lg mt-10">
        <div>
          <div className="grid gap-y-3">
            <input
              placeholder="Text-to-Image Prompt"
              disabled={image !== null || isGenerating || !nftCollectionContext?.metamaskAccount}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="m-auto w-96 h-10 focus:border-[#fe5cb8] rounded-md text-black py-3 px-4 outline-none transition"
            />
            <p className="mx-auto -mt-2 text-xs w-96 focus:border-[#fe5cb8] rounded-md text-white outline-none transition">
              Try: `A dream of a distant galaxy, concept art, matte painting, HQ, 4k`
            </p>
            {image ? (
              <>
                <div className="m-auto w-9/12 flex mb-12 mt-5 gap-5 flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2 mb-10 sm:mb-0">
                    <img className="my-10 object-cover h-full" src={image} />
                  </div>
                  <div className="w-full sm:w-1/2 flex flex-col justify-center gap-5">
                    {!nftCollectionContext?.isMinted ? (
                      <>
                        <div className="flex flex-col items-center">
                          <p className="text-white text-3xl font-bold">Like NFT ?</p>
                          <p className="text-white text-md">Give it a name and a descriptino and MINT it to own !</p>
                        </div>
                        <input
                          disabled={nftCollectionContext?.isMinting}
                          placeholder="NFT Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-10 focus:border-[#fe5cb8] rounded-md text-black py-3 px-4 outline-none transition"
                        />
                        <input
                          disabled={nftCollectionContext?.isMinting}
                          placeholder="NFT Description"
                          value={description}
                          maxLength={100}
                          onChange={(e) => setDescription(e.target.value)}
                          className="h-10 focus:border-[#fe5cb8] rounded-md text-black py-3 px-4 outline-none transition"
                        />
                        <button
                          disabled={nftCollectionContext?.isMinting}
                          className="h-13 border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center"
                          onClick={handleMint}
                        >
                          {!nftCollectionContext?.isMinting ? (
                            "Mint"
                          ) : (
                            <>
                              Minting your NFT <CircularProgress sx={{ marginLeft: "10px" }} color="inherit" size="1rem" />
                            </>
                          )}
                        </button>
                        {!nftCollectionContext?.isMinting && (
                          <>
                            {" "}
                            <p className="text-white text-md mt-5">Or reset and generate new one</p>
                            <button
                              className="w-full bg-red-800 text-white font-[Courier] duration-500 px-6 py-2 rounded"
                              onClick={handleResetImage}
                            >
                              Reset
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center">
                          <p className="text-white text-3xl font-bold text-center mb-5">NFT Minted Successfully!</p>
                          <p className="text-white text-md text-center mb-10">
                            Check your Wallet to see the NFT here! 👉{" "}
                            <span className="text-red-400 underline">
                              <a
                                href={`https://testnets.opensea.io/${nftCollectionContext.metamaskAccount}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                OpenSea
                              </a>
                            </span>
                          </p>
                          <button
                            className="w-full border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center h-10"
                            onClick={handleResetImage}
                          >
                            Mint Again!
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={handleGenerateImage}
                disabled={image !== null || isGenerating}
                type="submit"
                className="m-auto w-96 border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center h-10"
              >
                {!nftCollectionContext?.metamaskAccount ? (
                  "Connect Wallet"
                ) : !isGenerating ? (
                  "Generate AI Image"
                ) : (
                  <>
                    AI is generating your image <CircularProgress sx={{ marginLeft: "10px" }} color="inherit" size="1rem" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintNft;
