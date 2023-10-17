import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "solidity-docgen";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
	docgen: {},
	networks: {
		local1: {
			url: "http://localhost:8545/",
		},
		local2: {
			url: "http://localhost:8546/",
		},
		hardhat: {
			allowUnlimitedContractSize: false,
		},
		mainnet: {
			url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		ropsten: {
			url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		rinkeby: {
			url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		goerli: {
			url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		kovan: {
			url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		arbitrumRinkeby: {
			url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		arbitrum: {
			url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		optimismKovan: {
			url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		optimism: {
			url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		mumbai: {
			url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
		polygon: {
			url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: { mnemonic: process.env.MNEMONIC },
		},
	},
	etherscan: {
		// API key for Etherscan
		// Only required for deployments
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
	solidity: {
		version: "0.8.17",
		settings: {
			optimizer: {
				enabled: true,
				runs: 800,
			},
			metadata: {
				// do not include the metadata hash, since this is machine dependent
				// and we want all generated code to be deterministic
				// https://docs.soliditylang.org/en/v0.7.6/metadata.html
				bytecodeHash: "none",
			},
		},
	},
};

export default config;
