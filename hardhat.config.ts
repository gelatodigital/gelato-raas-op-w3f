import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

import "@matterlabs/hardhat-zksync-verify";
import "@nomicfoundation/hardhat-verify";
import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import * as glob from 'glob';
import { resolve } from 'path';



const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";

// dynamically changes endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
      }
    : {
        url: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli",
        zksync: true,
        // contract verification endpoint
        verifyURL:
          "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
      };

      const zkSync =
      process.env.NODE_ENV == "test"
        ? {
            url: "http://localhost:3050",
            ethNetwork: "http://localhost:8545",
            zksync: true,
          }
        : {
            url: "https://mainnet.era.zksync.io",
            ethNetwork: "ethereum",
            zksync: true,
       
            verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification'
            // contract verification endpoint
        
          };

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest",
    settings: {},
  },
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: ["hardhat", "zkSync","polygon"], //(multiChainProvider) injects provider for these networks
  },
  defaultNetwork: "zkSync",
  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncTestnet,
    zkSync,
    polygon: {
      chainId: 137,
      url: "https://polygon-rpc.com",
    },
  },
  etherscan: { // Optional - If you plan on verifying a smart contract on Ethereum within the same project
    apiKey:  ETHERSCAN_KEY //<Your API key for Etherscan>,
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
