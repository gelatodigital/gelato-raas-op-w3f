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

glob.sync('./tasks/**/*.ts').forEach(function (file: any) {
  require(resolve(file));
});

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
    networks: ["hardhat", "mumbai"], //(multiChainProvider) injects provider for these networks
  },
  defaultNetwork: "zkSync",
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet,
    zkSync,
  },
  etherscan: { // Optional - If you plan on verifying a smart contract on Ethereum within the same project
    apiKey: "8YIR2SATQRH4HV2FQBHWJIV1HMFCNYQI8V" //<Your API key for Etherscan>,
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
