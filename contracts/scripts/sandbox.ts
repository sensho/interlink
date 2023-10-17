import { ethers } from "hardhat";

const main = async () => {
	const Nft = await ethers.getContractFactory("TestNFT");
	const nft = await Nft.attach("0x08e664C62E2ff8B390051eF24B08167204B6e62C");

    console.log(`Balance: ${await nft.balanceOf("0xCF5B123Ea094A776dD20fA07c3Ea433B54323CBd")}`)

	/*
	const Coordinator = await ethers.getContractFactory("AugmintCoordinator");
	const coordinator = await Coordinator.attach("0xF6aC3c345296DCd381659Dff0bD04b53Ec213Bee");

	console.log(`Data: ${await coordinator.getOutgoingRequestStatus(0)}`);
    */
};

main().catch(console.error);
