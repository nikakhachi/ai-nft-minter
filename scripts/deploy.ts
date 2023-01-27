import { ethers } from "hardhat";

async function main() {
  const NFTCollectionFactory = await ethers.getContractFactory("NFTCollection");
  const contract = await NFTCollectionFactory.deploy("AI_NFT_Collection", "ANC");

  await contract.deployed();

  console.log(`NFTCollection deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
