
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import hre from "hardhat";
// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts/contracts/MockSwap.sol/MockSwap.json";
import { MockSwap } from "../typechain/MockSwap";

const PK = process.env.PK || "";

if (!PK)
  throw "⛔️ Private key not detected! Add it to the .env file!";
// Address of the contract on testnet
const CONTRACT_ADDRESS = "0x76243f8B81C6C88293B7d522920D408B4061F114";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
const swap  = async() => {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Initialize the provider.
  // @ts-ignore
  const provider = hre.ethers.provider
  const signer = new ethers.Wallet(PK, provider);

  // Initialize contract instance
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ContractArtifact.abi,
    signer
  ) as MockSwap; 

  // Initial swap
  const price=  "19182340"
  const tx2 = await contract.swap("0xB65540bBA534E88EB4a5062D0E6519C07063b259",price,true)
  await tx2.wait();
  

  

  // Read message after transaction
 
}

swap()