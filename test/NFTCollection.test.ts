import { Contract } from "ethers";
import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { bigNumberToInt } from "../next/src/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NFTCollection } from "../typechain-types";

describe("NFCollection Contract", function () {
  let contract: NFTCollection;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress; // Without Initial NFT

  let nfts: { owner: string; uri: string }[] = [];

  this.beforeEach(async () => {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();

    const NFTCollectionFactory = await ethers.getContractFactory("NFTCollection");
    contract = await NFTCollectionFactory.deploy("NikaNFTCollection", "NNC");
    await contract.deployed();

    nfts = [
      { owner: owner.address, uri: "uri1" },
      { owner: user1.address, uri: "uri2" },
      { owner: user3.address, uri: "uri3" },
      { owner: owner.address, uri: "uri4" },
      { owner: user2.address, uri: "uri5" },
      { owner: user3.address, uri: "uri6" },
    ];

    await Promise.all(nfts.map((nft) => contract.safeMint(nft.owner, nft.uri)));
  });

  it("Getting all token data", async function () {
    const nftsRes = await contract.getAllTokenData();

    nftsRes.forEach((nft: any, index: number) => {
      expect(nft.owner).to.be.a("string");
      expect(nft.uri).to.be.a("string");
      expect(bigNumberToInt(nft.id)).to.be.a("number");
      expect(nft.owner).to.eq(nfts.find((item) => item.uri === nft.uri)?.owner);
    });
  });

  describe("Receive & Withdraw", function () {
    it("Only owner is able to call withdraw()", async function () {
      await expect(contract.connect(user1).withdraw()).to.revertedWith("Ownable: caller is not the owner");
      await contract.withdraw();
    });
    it("withdraw() withdraws all funds and transfers it to owner", async function () {
      const contractBalance = async () => Number(ethers.utils.formatEther(await provider.getBalance(contract.address)));
      const ownerBalance = async () => Number(ethers.utils.formatEther(await owner.getBalance()));
      const provider = waffle.provider;
      await user1.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther("10.0"),
      });
      expect(await contractBalance()).to.eq(10);
      const ownerBalanceBeforeWithdrawing = await ownerBalance();
      await contract.withdraw();
      const ownerBalanceAfterWithdrawing = await ownerBalance();
      const ownerBalancePositiveDelta = Number(ownerBalanceAfterWithdrawing.toFixed()) - Number(ownerBalanceBeforeWithdrawing.toFixed());
      expect(ownerBalancePositiveDelta).to.eq(10);
    });
  });

  it("Increase Max Supply", async function () {
    const initialMaxSupply = await contract.MAX_SUPPLY();
    const nToIncreaseSupply = 20;

    await contract.increaseMaxSupply(nToIncreaseSupply);

    expect(await contract.MAX_SUPPLY()).to.eq(initialMaxSupply + nToIncreaseSupply);
  });

  it("Should Mint", async function () {
    expect((await contract.balanceOf(user4.address)).toNumber()).to.eq(0);

    const tokenUri = "randomTokenUri";

    await contract.connect(user4).safeMint(user4.address, tokenUri);

    const userNftBalance = (await contract.balanceOf(user4.address)).toNumber();

    expect(userNftBalance).to.eq(1);

    const nft = await contract.tokenOfOwnerByIndex(user4.address, userNftBalance - 1);

    expect(await contract.ownerOf(nft)).to.eq(user4.address);
    expect(await contract.tokenURI(nft)).to.eq(tokenUri);
  });
});
