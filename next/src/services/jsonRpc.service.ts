import { CONTRACT_ADDRESS } from "@/constants";
import { ethers } from "ethers";
import CONTRACT_JSON from "@/constants/contract.json";
import { bigNumberToInt } from "@/utils";

const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", new ethers.providers.JsonRpcProvider(process.env.GOERLI_ALCHEMY_URL));
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_JSON.abi, signer);

const isTotalSupplyLessThanMaxSupply = async () => {
  const [maxSupply, totalSupply] = await Promise.all([
    contract.MAX_SUPPLY().then((item: any) => bigNumberToInt(item)),
    contract.totalSupply().then((item: any) => bigNumberToInt(item)),
  ]);
  return totalSupply < maxSupply;
};

export const jsonRpsServices = { isTotalSupplyLessThanMaxSupply };