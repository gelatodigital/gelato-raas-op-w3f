import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/MockSwap.sol/MockSwap.json";
import { MockSwap } from "../typechain-types/MockSwap";


const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const CONTRACT_ADDRESS = "0xBa8Cb453D1238Cbb37A083A6B1fda4EB384E6897";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSync?.url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // Initialize contract instance
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ContractArtifact.abi,
    signer
  ) as MockSwap; 



  // send transaction to deposit and set operator
  const deposit =  1000000000
  const tx = await contract.deposit("0xB65540bBA534E88EB4a5062D0E6519C07063b259",deposit)
  await tx.wait();
  console.log(`Deposited ${deposit} into ${CONTRACT_ADDRESS} in ${tx.hash} `);

  const tx2 = await contract.setOperator("0x33cf616a7405b4464653f9d543052a1b416c35b1")
  await tx2.wait();
  console.log(`Transaction to set operator ${tx2.hash}`);
  

  // Read message after transaction
 
}
