import { BigNumber, ethers } from "ethers";

import dotenv from "dotenv";
dotenv.config();

import coordinatorArtifact from "../artifacts/coordinator-abi.json";

type Request = {
    requestId: BigNumber;
    chainId: BigNumber;
    address: string;
    amount: BigNumber;
};

const mnemonic = process.env.MNEMONIC;

if (!mnemonic) throw new Error("Mnemonic not found");

const provider1 = new ethers.providers.JsonRpcProvider(
    process.env.FIRST_CHAIN_RPC_URL
);
const provider2 = new ethers.providers.JsonRpcProvider(
    process.env.SECOND_CHAIN_RPC_URL
);

const wallet1 = ethers.Wallet.fromMnemonic(mnemonic).connect(provider1);
const wallet2 = ethers.Wallet.fromMnemonic(mnemonic).connect(provider2);

const chain1Coordinator = new ethers.Contract(
    process.env.FIRST_CHAIN_COORDINATOR_ADDRESS || "",
    coordinatorArtifact.abi,
    wallet1
);
const chain2Coordinator = new ethers.Contract(
    process.env.SECOND_CHAIN_COORDINATOR_ADDRESS || "",
    coordinatorArtifact.abi,
    wallet2
);

const handleRequest = async ({
    requestId,
    address,
    amount,
}: Request): Promise<void> => {
    const request = await chain1Coordinator.getOutgoingRequestStatus(requestId);

    if (request.status !== 1) return;

    const tx = await chain2Coordinator.acceptIncomingPaymentRequest(
        requestId,
        address,
        amount
    );

    await tx.wait();
};

const handleFulfill = async (data: {
    requestId: BigNumber;
    isSuccess: true;
    data: string;
}) => {
    const tx = await chain1Coordinator.fullfillRequest(
        data.requestId,
        data.isSuccess,
        data.data
    );

    await tx.wait();
};

const main = async () => {
    console.log(
        `Chain 1: Signer --- ${await wallet1.getAddress()}; Balance --- ${await wallet1.getBalance()}\nChain 2: Signer --- ${await wallet2.getAddress()}; Balance --- ${await wallet2.getBalance()}`
    );

    chain1Coordinator.on(
        "NativePaymentRequestInitiated",
        (requestId, chainId, address, amount) => {
            console.log("Request Recieved", {
                requestId,
                chainId,
                address,
                amount,
            });

            handleRequest({
                requestId,
                chainId,
                address,
                amount,
            }).catch(console.error);
        }
    );

    chain1Coordinator.on(
        "RequestFulfilled",
        (requestId, isFulfillSuccess, isCallbackSuccess, data) => {
            console.log("Request Fulfilled", {
                requestId,
                isFulfillSuccess,
                isCallbackSuccess,
                data,
            });
        }
    );

    chain2Coordinator.on("RequestCompleted", (requestId, isSuccess, data) => {
        console.log("Request Completed", { requestId, isSuccess, data });
        handleFulfill({ requestId, isSuccess, data }).catch(console.error);
    });
};

main().catch((err) => {
    console.error(err);
});
