import { useContext, useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { CircularProgress } from "@mui/material";

const MintNft = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

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
    setIsGenerating(true);
    const uniqueId = uuid();
    try {
      const res = await axios.post("/api/generate-image", { keyword, uuid: uniqueId }, { responseType: "arraybuffer" });
      // const base64 = `data:image/png;base64,${btoa(
      //   new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
      // )}`;
      const blob = new Blob([res.data], { type: "image/png" });
      setImage(URL.createObjectURL(blob));
      setCurrentImageMetadata({
        blob,
        uuid: uniqueId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetImage = () => {
    setImage(null);
    setCurrentImageMetadata(undefined);
  };

  const handleMint = async () => {
    if (currentImageMetadata) {
      const { data } = await axios.post("/api/ipfs-upload", { uuid: currentImageMetadata?.uuid, name, description });
      nftCollectionContext?.mint(data.path);
    }
  };
  return (
    <div className="flex justify-center">
      <div className="w-full  rounded-lg mt-10">
        <div>
          <div className="grid gap-y-3">
            {!nftCollectionContext?.metamaskAccount ? (
              <button
                onClick={nftCollectionContext?.connectToWallet}
                disabled={image !== null || isGenerating}
                type="submit"
                className="m-auto mt-10 w-96 border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center h-10"
              >
                Connect the Wallet
              </button>
            ) : (
              <>
                <input
                  disabled={image !== null || isGenerating}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="m-auto w-96 h-10 focus:border-[#fe5cb8] rounded-md text-black py-3 px-4 outline-none transition"
                />
                {image ? (
                  <>
                    <div className="m-auto w-9/12 flex mb-12 mt-5 gap-5 flex-col sm:flex-row">
                      <div className="w-full sm:w-1/2 mb-10 sm:mb-0">
                        <img className="my-10 object-cover h-full" src={image} />
                      </div>
                      <div className="w-full sm:w-1/2 flex flex-col justify-center gap-5">
                        <div className="flex flex-col items-center">
                          <p className="text-white text-3xl font-bold">Like NFT ?</p>
                          <p className="text-white text-md">Give it a name and a descriptino and MINT it to own !</p>
                        </div>
                        <input
                          placeholder="NFT Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-10 focus:border-[#fe5cb8] rounded-md text-black py-3 px-4 outline-none transition"
                        />
                        <input
                          placeholder="NFT Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="h-10 focus:border-[#fe5cb8] rounded-md text-black py-3 px-4 outline-none transition"
                        />
                        <button
                          className="border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded"
                          onClick={handleMint}
                        >
                          Mint
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-white text-md mt-9">Or reset and generate new one</p>
                    </div>
                    <button
                      className="m-auto w-96 bg-red-800  text-white font-[Courier] duration-500 px-6 py-2 rounded"
                      onClick={handleResetImage}
                    >
                      Reset
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGenerateImage}
                    disabled={image !== null || isGenerating}
                    type="submit"
                    className="m-auto w-96 border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center h-10"
                  >
                    {!isGenerating ? "Generate AI Image" : <CircularProgress color="inherit" size="1rem" />}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintNft;
