import { BigNumber } from "ethers";

export const shortenAddress = (address: string) => (address ? `${address.slice(0, 10)}...${address.slice(address.length - 5)}` : "");

export const bigNumberToInt = (n: BigNumber) => Number(n.toString());

export const ipfsUriToUrl = (uri: string) => `https://ipfs.io/ipfs/${uri.split("//")[1]}`;
