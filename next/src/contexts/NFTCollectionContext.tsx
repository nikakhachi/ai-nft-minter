import { createContext, useState, PropsWithChildren, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { SnackbarContext } from "./SnackbarContext";
import { CONTRACT_ADDRESS } from "@/constants";
import CONTRACT_JSON from "@/constants/contract.json";

type NFTCollectionContextType = {
  metamaskWallet: any;
  metamaskAccount: any;
  connectToWallet: () => void;
  isLoading: boolean;
  getSigner: () => ethers.providers.JsonRpcSigner;
  mint: (ipfsId: string) => void;
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
    const contract = getContract(getSigner());
    const txn = await contract.safeMint(metamaskAccount, `ipfs://${ipfsId}`);
    await txn.wait();
    console.log("MINTED !");
  };

  const value = {
    metamaskWallet,
    metamaskAccount,
    connectToWallet,
    isLoading,
    getSigner,
    mint,
  };

  return <NFTCollectionContext.Provider value={value}>{children}</NFTCollectionContext.Provider>;
};
