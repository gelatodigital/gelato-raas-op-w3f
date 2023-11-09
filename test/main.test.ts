import { expect } from "chai";

import hre, { w3f } from "hardhat";
const { ethers, deployments } = hre;

import { Web3FunctionResultV2 } from "@gelatonetwork/web3-functions-sdk/*";
import { MockSwap } from "../typechain/MockSwap";


describe("MockSwap", function () {
  it("Should run", async function () {
    if (hre.network.name !== "hardhat") {
      console.error("Test Suite is meant to be run on hardhat only");
      process.exit(1);
    }

    await deployments.fixture();

    const[deployer] = await ethers.getSigners();
    

    const  mockSwap = (await ethers.getContractAt(
      "MockSwap",
      (
        await deployments.get("MockSwap")
      ).address
    )) as MockSwap;

    let userPair = await mockSwap.balanceByUser(deployer.address);

    const depositValue = 10000 * 10 ** 6;
    const depositTx = await mockSwap.deposit(
     await  deployer.address,
      depositValue
    );
    await depositTx.wait();


    userPair = await mockSwap.balanceByUser(deployer.address);

    const mockSwapW3f = w3f.get("trade");

    let userArgs = {
      user: deployer.address,
      contract: mockSwap.address,
    };

   

    let w3f1 = await mockSwapW3f.run({ userArgs});
    let result = w3f1.result as Web3FunctionResultV2;

    expect(result.canExec).to.equal(true);

    if (result.canExec == true) {
      const data = result.callData[0];

      let w3fTx = await deployer.sendTransaction({
        to: data.to,
        data: data.data,
      });

      await w3fTx.wait();
      userPair = await mockSwap.balanceByUser(deployer.address);

      const storage = {
        lastMax: "3200.00",
        lastMin: "0",
      };

      const w3f2 = await mockSwapW3f.run({ userArgs, storage });

      let result2 = w3f2.result as Web3FunctionResultV2;
      expect(result2.canExec).to.equal(true);
      if (result2.canExec == true) {
        const data2 = result2.callData[0];
        let w3fTx2 = await deployer.sendTransaction({
          to: data2.to,
          data: data2.data,
        });

        await w3fTx2.wait();
        userPair = await mockSwap.balanceByUser(deployer.address);
      }
    }
  });
});
