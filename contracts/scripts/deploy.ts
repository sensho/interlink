import { ethers } from "hardhat";

async function main() {
	const Coordinator = await ethers.getContractFactory("AugmintCoordinator");
	const coordinator = await Coordinator.deploy();

	await coordinator.deployed();

	console.log(`Coordinator has been deployed to ${coordinator.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
