import { CONTRACT_ADDRESS } from "@/constants";
import { ethers } from "ethers";
import CONTRACT_JSON from "@/constants/contract.json";
import { bigNumberToInt } from "@/utils";
import { NFTResType } from "@/contexts/NFTCollectionContext";

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_JSON.abi,
  new ethers.providers.JsonRpcProvider(process.env.GOERLI_ALCHEMY_URL)
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
