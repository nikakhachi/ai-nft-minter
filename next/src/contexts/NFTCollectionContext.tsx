import { createContext, useState, PropsWithChildren, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { SnackbarContext } from "./SnackbarContext";
import { CONTRACT_ADDRESS } from "@/constants";
import CONTRACT_JSON from "@/constants/contract.json";
import axios from "axios";
import { bigNumberToInt } from "@/utils";

type NftType = {
  imageUrl: string;
  id: number;
  owner: string;
  name: string;
  description: string;
};

type NFTCollectionContextType = {
  metamaskWallet: any;
  metamaskAccount: any;
  connectToWallet: () => void;
  isLoading: boolean;
  getSigner: () => ethers.providers.JsonRpcSigner;
  mint: (ipfsId: string) => void;
  fetchAllNfts: () => void;
  allNfts: NftType[];
  userNfts: NftType[];
  areNftsLoading: boolean;
  isMinting: boolean;
  nftOwners: string[];
  setIsMinting: (b: boolean) => void;
  isMinted: boolean;
  fetchDataFromContract: () => void;
  maxSupply?: number;
  totalSupply?: number;
};

let metamaskWallet: ethers.providers.ExternalProvider | undefined;
if (typeof window !== "undefined") {
  metamaskWallet = window.ethereum;
}

export const NFTCollectionContext = createContext<NFTCollectionContextType | null>(null);

export const NFTCollectionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const snackbarContext = useContext(SnackbarContext);

  const [metamaskAccount, setMetamaskAccount] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState<ethers.Contract>();

  const [areNftsLoading, setAreNftsLoading] = useState(true);
  const [allNfts, setAllNfts] = useState<NftType[]>([]);
  const [userNfts, setUserNfts] = useState<NftType[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [nftOwners, setNftOwners] = useState<string[]>([]);
  const [isMinted, setIsMinted] = useState(false);
  const [maxSupply, setMaxSupply] = useState<number>();
  const [totalSupply, setTotalSupply] = useState<number>();

  useEffect(() => {
    (async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setMetamaskAccount(account);
        setIsLoading(false);
      }
      (metamaskWallet as any).on("accountsChanged", (accounts: any[]) => setMetamaskAccount(accounts[0]));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findMetaMaskAccount = async () => {
    try {
      if (!metamaskWallet || !metamaskWallet.request) return null;

      const accounts = await metamaskWallet.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        return account;
      } else {
        setIsLoading(false);
        console.error("No authorized account found");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const connectToWallet = async () => {
    if (!metamaskWallet || !metamaskWallet.request) return null;

    const accounts = await metamaskWallet.request({
      method: "eth_requestAccounts",
    });

    setMetamaskAccount(accounts[0]);
    return accounts[0];
  };

  const getSigner = () => {
    if (metamaskWallet && metamaskAccount) {
      const provider = new ethers.providers.Web3Provider(metamaskWallet);
      const signer = provider.getSigner();
      return signer;
    } else {
      throw alert("Connect to Wallet");
    }
  };

  //
  //
  // CONTRACT FUNCTIONS BELOW
  //
  //

  const getContract = (signer: ethers.Signer | ethers.providers.Provider | undefined): ethers.Contract => {
    if (contract) return contract;
    const fetchedContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_JSON.abi, signer);
    setContract(fetchedContract);
    return fetchedContract;
  };

  const mint = async (ipfsId: string) => {
    try {
      setIsMinting(true);
      const contract = getContract(getSigner());
      const txn = await contract.safeMint(metamaskAccount, `ipfs://${ipfsId}`);
      await txn.wait();
      setIsMinted(true);
    } catch (error) {
      snackbarContext?.open("Something went wrong", "error");
    } finally {
      setIsMinting(false);
    }
  };

  const fetchAllNfts = async () => {
    setAreNftsLoading(true);

    try {
      const contract = getContract(getSigner());
      const allNftsRes = await contract.getAllTokenUrls();

      const userTokenCount = bigNumberToInt(await contract.balanceOf(metamaskAccount));

      const tokenIdsOwnedByUser: number[] = [];
      for (let i = 0; i < userTokenCount; i++) {
        tokenIdsOwnedByUser.push(bigNumberToInt(await contract.tokenOfOwnerByIndex(metamaskAccount, i)));
      }

      const allNftsFinal: NftType[] = await Promise.all(
        allNftsRes.map((item: string, index: number) =>
          axios.get(`https://ipfs.io/ipfs/${item.split("//")[1]}`).then(({ data: metadata }) =>
            contract.ownerOf(index).then((owner: string) => ({
              name: metadata.name,
              description: metadata.description,
              owner: owner,
              id: index,
              imageUrl: metadata.image,
            }))
          )
        )
      );

      setAllNfts(allNftsFinal);
      setUserNfts(allNftsFinal.filter((item) => item.owner.toUpperCase() === metamaskAccount?.toUpperCase()));
      setNftOwners([...new Set(allNftsFinal.map((item) => item.owner))]);
    } catch (error) {
      snackbarContext?.open("Something went wrong", "error");
    } finally {
      setAreNftsLoading(false);
    }
  };

  const fetchSupplies = async () => {
    const contract = getContract(getSigner());

    const totalSupplyRes = bigNumberToInt(await contract.totalSupply());
    const maxSupplyRes = bigNumberToInt(await contract.MAX_SUPPLY());

    setTotalSupply(totalSupplyRes);
    setMaxSupply(maxSupplyRes);
  };

  const fetchDataFromContract = () => {
    fetchAllNfts();
    fetchSupplies();
  };

  const value = {
    metamaskWallet,
    metamaskAccount,
    connectToWallet,
    isLoading,
    getSigner,
    mint,
    fetchAllNfts,
    allNfts,
    userNfts,
    areNftsLoading,
    isMinting,
    nftOwners,
    setIsMinting,
    isMinted,
    fetchDataFromContract,
    totalSupply,
    maxSupply,
  };

  return <NFTCollectionContext.Provider value={value}>{children}</NFTCollectionContext.Provider>;
};
