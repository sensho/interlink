import ganache from "ganache";

import dotenv from 'dotenv';
dotenv.config();

const startBlockchain = (
    PORT: number = 8545
): Promise<{
    provider: any;
    accounts: string[];
}> => {
    return new Promise((resolve, reject) => {
        const options = {
            wallet: {
                mnemonic: process.env.MNEMONIC,
            },
        };

        const server = ganache.server(options);
        server.listen(PORT, async (err: any) => {
            if (err) reject(err);

            console.log(`ganache listening on port ${PORT}...`);

            const provider = server.provider;
            const accounts = await provider.request({
                method: "eth_accounts",
                params: [],
            });

            resolve({ provider, accounts });
        });
    });
};

const main = async (): Promise<void> => {
    const { accounts: acc1 } = await startBlockchain(8545);
    const { accounts: acc2 } = await startBlockchain(8546);

    console.log(`Account1 : ${acc1[0]}; Account2: ${acc2[0]}`);
};

main().catch((err) => {
    console.error(err);
});
