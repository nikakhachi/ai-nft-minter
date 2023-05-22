import { NFTCollectionContext } from "@/contexts/NFTCollectionContext";
import { shortenAddress } from "@/utils";
import { forwardRef, useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { CircularProgress, TextField } from "@mui/material";
import { CONTRACT_ADDRESS } from "@/constants";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const items: any[] = [];

const NavBar = () => {
  const nftCollectionContext = useContext(NFTCollectionContext);
  const [open, setOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [isTipLoading, setIsTipLoading] = useState(false);

  const handleDialog = () => {
    setOpen((b) => !b);
  };

  const handleTip = async () => {
    try {
      setIsTipLoading(true);
      await nftCollectionContext?.tip(tipAmount);
      handleDialog();
    } catch (error) {
      console.log(error);
    } finally {
      setIsTipLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!nftCollectionContext?.metamaskAccount) {
      nftCollectionContext?.connectToWallet();
    }
  };

  return (
    <>
      <nav className="py-5 px-10 text-white md:flex md:items-center md:justify-between">
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://goerli.etherscan.io/address/${CONTRACT_ADDRESS}`}
          className="text-2xl font-[Courier] cursor-pointer"
        >
          AI-Minted
        </a>

        <ul className="font-[Proxima Nova] flex">
          {items.map((item) => (
            <li key={item.text} className={item.liClassName}>
              <a href={item.href} className={item.aClassName}>
                {item.text}
              </a>
            </li>
          ))}
          <button
            onClick={handleDialog}
            className="border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-1 rounded flex items-center"
          >
            TIP
          </button>
          <button onClick={handleButtonClick} className="bg-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 mx-4 rounded ">
            {!nftCollectionContext?.metamaskAccount ? "Connect Wallet" : shortenAddress(nftCollectionContext.metamaskAccount)}
          </button>
          <h2 className=""></h2>
        </ul>
      </nav>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Thanks for your Support!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose any ETH amount you want to tip</DialogContentText>
          <TextField
            disabled={isTipLoading}
            value={tipAmount}
            onChange={(e) => setTipAmount(Number(e.target.value))}
            sx={{ margin: "0.5rem 0 1.5rem 0" }}
            type="number"
            size="small"
          />
          <DialogContentText>
            Or send the tokens here: <span className="italic font-bold">0xf05F17d6Fb0C5C3d431059d6064bD8e0352dfadf</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDialog}>
            Close
          </Button>
          <Button variant="outlined" disabled={isTipLoading} onClick={handleTip}>
            {isTipLoading ? <CircularProgress size="1.5rem" /> : "Tip"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavBar;
