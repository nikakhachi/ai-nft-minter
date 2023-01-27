import { Contract, Signer } from "ethers";
import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { bigNumberToInt } from "../next/src/utils";

describe("NFCollection Contract", function () {
  let contract: Contract;
  let owner: Signer;
  let ownerAddress: string;
  let user1: Signer;
  let user1Address: string;
  let user2: Signer;
  let user2Address: string;
  let user3: Signer;
  let user3Address: string;

  let nfts: { owner: string; uri: string }[] = [];

  this.beforeEach(async () => {
    [owner, user1, user2, user3] = await ethers.getSigners();

    [ownerAddress, user1Address, user2Address, user3Address] = await Promise.all([
      owner.getAddress(),
      user1.getAddress(),
      user2.getAddress(),
      user3.getAddress(),
    ]);

    const NFTCollectionFactory = await ethers.getContractFactory("NFTCollection");
    contract = await NFTCollectionFactory.deploy("NikaNFTCollection", "NNC");
    await contract.deployed();

    nfts = [
      { owner: ownerAddress, uri: "uri1" },
      { owner: user1Address, uri: "uri2" },
      { owner: user3Address, uri: "uri3" },
      { owner: ownerAddress, uri: "uri4" },
      { owner: user2Address, uri: "uri5" },
      { owner: user3Address, uri: "uri6" },
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
    it("Not owner isn't able to call withdraw()", async function () {
      await expect(contract.connect(user1).withdraw()).to.revertedWith("Ownable: caller is not the owner");
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
});
