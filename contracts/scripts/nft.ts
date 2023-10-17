import { ethers } from "hardhat";

async function main() {
	const Nft = await ethers.getContractFactory("TestNFT");
	const nft = await Nft.deploy("0x940504bE6BB934f6ABe2cd00b6033a70919A4bA3");

	await nft.deployed();

	console.log(`NFT has been deployed to ${nft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
