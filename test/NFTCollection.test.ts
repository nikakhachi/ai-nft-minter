import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const NFTCollectionFactory = await ethers.getContractFactory("NFTCollection");
    const contract = await NFTCollectionFactory.deploy("NikaNFTCollection", "NNC");

    await contract.deployed();

    const [owner, otherAccount] = await ethers.getSigners();

    return { NFTCollectionFactory, contract, owner, otherAccount };
  }

  // describe("Deployment", function () {
  //   it("Should set the right unlockTime", async function () {
  //     const {} = await loadFixture(deployOneYearLockFixture);

  //     expect(await lock.unlockTime()).to.equal(unlockTime);
  //   });
  // });
});
