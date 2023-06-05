import { ethers } from "ethers";
import { bigNumberToInt } from "@/utils";
import { NFTResType } from "@/contexts/NFTCollectionContext";
import { NFT_COLLECTION_ABI, NFT_COLLECTION_ADDRESS } from "@/contracts/nftCollection";

const contract = new ethers.Contract(
  NFT_COLLECTION_ADDRESS,
  NFT_COLLECTION_ABI,
  new ethers.providers.WebSocketProvider(process.env.GOERLI_ALCHEMY_URL_WS as string)
);

const isTotalSupplyLessThanMaxSupply = async () => {
  const [maxSupply, totalSupply] = await Promise.all([
    contract.MAX_SUPPLY().then((item: any) => bigNumberToInt(item)),
    contract.totalSupply().then((item: any) => bigNumberToInt(item)),
  ]);
  return totalSupply < maxSupply;
};

const fetchNfts = async () => {
  const allNftsRes: NFTResType[] = (await contract.getAllTokenData()).map((item: any) => ({
    id: bigNumberToInt(item.id),
    owner: item.owner,
    uri: item.uri,
  }));
  return allNftsRes;
};

const fetchSupplies = async () => {
  const [maxSupply, totalSupply] = await Promise.all([
    contract.MAX_SUPPLY().then((item: any) => bigNumberToInt(item)),
    contract.totalSupply().then((item: any) => bigNumberToInt(item)),
  ]);
  return { maxSupply, totalSupply };
};

export const jsonRpsServices = { isTotalSupplyLessThanMaxSupply, fetchNfts, fetchSupplies };
