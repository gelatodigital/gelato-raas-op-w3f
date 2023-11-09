
import * as ethers from "ethers";
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

// Address of the contract on  testnet
const CONTRACT_ADDRESS = "0x76243f8B81C6C88293B7d522920D408B4061F114";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
const deposit= async () =>{
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



  // send transaction to deposit and set operator
  const deposit =  1000000000
  const tx = await contract.deposit("0xB65540bBA534E88EB4a5062D0E6519C07063b259",deposit)
  await tx.wait();
  console.log(`Deposited ${deposit} into ${CONTRACT_ADDRESS} in ${tx.hash} `);

  const tx2 = await contract.setOperator("0xbB97656cd5fECe3a643335d03C8919D5E7DcD225")
  await tx2.wait();
  console.log(`Transaction to set operator ${tx2.hash}`);
  

  // Read message after transaction
 
}

deposit()