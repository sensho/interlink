import { ethers } from "hardhat";

const main = async () => {
	const Coordinator = await ethers.getContractFactory("AugmintCoordinator");
	const coordinator = await Coordinator.attach("0xF6aC3c345296DCd381659Dff0bD04b53Ec213Bee");

	const requestData = await coordinator.getRequestDetails(0);

	console.log({ amount: requestData.amount });

	const tx = await coordinator.makePayment(0, { value: requestData.amount });

	await tx.wait();
};

main().catch((err) => {
	console.error(err);
});
