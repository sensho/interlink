import { ethers } from "hardhat";

const main = async () => {
	const Nft = await ethers.getContractFactory("TestNFT");
	const nft = await Nft.attach("0x08e664C62E2ff8B390051eF24B08167204B6e62C");

    const tx = await nft.purchaseWithExternal();

    await tx.wait();
};

main().catch((err) => {
	console.log(err);
});
