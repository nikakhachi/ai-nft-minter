import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { shortenAddress } from "@/utils";
import { useContext } from "react";

const items: any[] = [];

const NavBar = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);

  const handleButtonClick = () => {
    if (!nftCollectionContext?.metamaskAccount) {
      nftCollectionContext?.connectToWallet();
    }
  };

  return (
    <>
      <nav className="py-5 px-10 text-white md:flex md:items-center md:justify-between">
        <div className="flex justify-between items-center ">
          <span className="text-2xl font-[Courier] cursor-pointer">AI NFT Generator</span>

          <span className="text-3xl cursor-pointer mx-2 md:hidden block">
            {/* <ion-icon name="menu" onclick="Menu(this)"></ion-icon> */}
          </span>
        </div>

        <ul className="font-[Proxima Nova] md:flex md:items-center z-[-1] md:z-auto md:static absolute w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-500">
          {items.map((item) => (
            <li key={item.text} className={item.liClassName}>
              <a href={item.href} className={item.aClassName}>
                {item.text}
              </a>
            </li>
          ))}
          <button onClick={handleButtonClick} className="bg-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 mx-4  rounded ">
            {!nftCollectionContext?.metamaskAccount ? "Connect Wallet" : shortenAddress(nftCollectionContext.metamaskAccount)}
          </button>
          <h2 className=""></h2>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
