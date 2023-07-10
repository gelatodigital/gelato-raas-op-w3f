import { task } from "hardhat/config";

export const verify = task("etherscan-verify", "verify").setAction(
  async ({}, hre) => {
    await hre.run("verify:verify", {
      address: "0x46B886Cb31B613339Fda33aA340eC351c78244dc",
      constructorArguments: [
      ],
    });
  }
);
