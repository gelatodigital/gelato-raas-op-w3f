import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-web3";
import hre, { ethers, w3f } from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { MockSwap } from "../typechain-types/MockSwap";
import { parseEther } from "ethers/lib/utils";
import { Web3FunctionResultV2 } from "@gelatonetwork/web3-functions-sdk/*";
import { impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";

const RICH_WALLET_PK =
  "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

async function deployMockSwap(deployer: Deployer): Promise<Contract> {
  const artifact = await deployer.loadArtifact("MockSwap");
  return await deployer.deploy(artifact, []);
}

describe("MockSwap", function () {
  it("Should run", async function () {
    const provider = await Provider.getDefaultProvider();

    const wallet = new Wallet(RICH_WALLET_PK, provider);
    const deployer = new Deployer(hre, wallet);

    const mockSwap = (await deployMockSwap(deployer)) as MockSwap;

    let userPair = await mockSwap.balanceByUser(deployer.zkWallet.address);

    const depositValue = 10000 * 10 ** 6;
    const depositTx = await mockSwap.deposit(
      deployer.zkWallet.address,
      depositValue
    );
    await depositTx.wait();

    userPair = await mockSwap.balanceByUser(deployer.zkWallet.address);

    const mockSwapW3f = w3f.get("trade");

    let userArgs = {
      user: deployer.zkWallet.address,
      contract: mockSwap.address,
    };



    let w3f1 = await mockSwapW3f.run({ userArgs });
    let result = w3f1.result as Web3FunctionResultV2;

    expect(result.canExec).to.equal(true);

    if (result.canExec == true) {
      const data = result.callData[0];

      let w3fTx = await deployer.zkWallet.sendTransaction({
        to: data.to,
        data: data.data,
      });

      await w3fTx.wait();
      userPair = await mockSwap.balanceByUser(deployer.zkWallet.address);

      const storage = {
        lastMax: "5200.00",
        lastMin: "0",
      };

      const w3f2 = await mockSwapW3f.run({ userArgs, storage });

      let result2 = w3f2.result as Web3FunctionResultV2;
      expect(result2.canExec).to.equal(true);
      if (result2.canExec == true) {
        const data2 = result2.callData[0];
        let w3fTx2 = await deployer.zkWallet.sendTransaction({
          to: data2.to,
          data: data2.data,
        });

        await w3fTx2.wait();
        userPair = await mockSwap.balanceByUser(deployer.zkWallet.address);
      }
    }
  });
});
