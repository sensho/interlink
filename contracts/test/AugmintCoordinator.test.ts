import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("AugmintCoordinator", () => {
	async function deployAugmintCoordinatorContract() {
		const AugmintCoordinator = await hre.ethers.getContractFactory("AugmintCoordinator");
		const coordinator = await AugmintCoordinator.deploy();

		return { coordinator };
	}

	it("Should deploy contract successfully", async () => {
		const { coordinator } = await loadFixture(deployAugmintCoordinatorContract);

		expect(coordinator).to.exist;
	});

	it("Should initiate read request", async () => {
		const { coordinator } = await loadFixture(deployAugmintCoordinatorContract);

		const [owner] = await hre.ethers.getSigners();

		let tx = await coordinator.initiateReadRequest(1, owner.address, []);

		await tx.wait();
	});
});
