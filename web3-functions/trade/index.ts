/* eslint-disable @typescript-eslint/naming-convention */
import {
  Web3Function,
  Web3FunctionContext,
  Web3FunctionResult,
} from "@gelatonetwork/web3-functions-sdk";

import { Contract, ethers } from "ethers";
import { uniswapQuote } from "./uniswap-quote";
import { MockSwapAbi } from "./abi";

import { MockSwap } from "../../typechain/MockSwap";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, storage, secrets, multiChainProvider } = context;


  const provider = multiChainProvider.default();

  const POLYGON_PROVIDER  = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");

  ///// User Args
  const user = userArgs.user as string;
  const MOCK_SWAP_ADDRESS  = userArgs.contract as string;


  ///// User Storage
  const lastMin =  +((await storage.get("lastMin")) ?? "0");
  const lastMax = +((await storage.get("lastMax")) ?? "0");

  //// Secrets
  const ENTRY = +((await secrets.get("ENTRY") ?? "2") as string) ;
  const EXIT = +((await secrets.get("EXIT")?? "2") as string);


 

  const mockSwapContract = new Contract(
    MOCK_SWAP_ADDRESS,
    MockSwapAbi,
    provider
  ) as MockSwap;


  
  let userBalance =  await mockSwapContract.balanceByUser(user);


  let wethBalance = +userBalance.weth.toString();


  let price = await uniswapQuote(POLYGON_PROVIDER);

  console.log(`Current Price: ${price}`);

  const activeTrade = wethBalance == 0 ? false : true;
  console.log(activeTrade ? "Active Trade" : "No trade");



  if (activeTrade) {

    /////  ==== We are IN TRADE ===================== /////
    ///  *****************************************************  ///
    if (lastMax == 0) {
      await storage.set("lastMax", price.toString());
      return { canExec: false, message: "Initiatig Price Exit" };
    }

    let diff = lastMax - price;
    if (diff < 0) {
      ///  *****************************************************  ///
      ///  Price is going up, update to new max
      ///  *****************************************************  ///
      await storage.set("lastMax", price.toString());
      console.log(
        `Old lastMax: ${lastMax.toString()}, New lastMax: ${price.toString()}`
      );
      return { canExec: false, message: "No Trade Exit ---> Price UP " };
    } else if (diff == 0) {
      ///  *****************************************************  ///
      ///  Price not moving doing Nothing
      ///  *****************************************************  ///
      return {
        canExec: false,
        message: `No Trade Exit ---> No Price change: ${price.toString()} `,
      };
    } else if (diff / lastMax < EXIT / 100) {
      ///  *****************************************************  ///
      ///  Price decrease too small, doing Nothing
      ///  *****************************************************  ///
      console.log(
        `Current lastMax: ${lastMax.toString()}, currentPrice: ${price.toString()}`
      );
      return {
        canExec: false,
        message: `No Trade Exit ---> Price decrease Small ${(
          (diff / lastMax) *
          100
        ).toFixed(2)} %`,
      };
    } else {
      ///  *****************************************************  ///
      ///  Price Decrease Greater than threshold ---> EXIT THE TRADE
      ///  *****************************************************  ///
      await storage.set("lastMin", price.toString());

      console.log(
        `Trade Exit---> Price Decrease ${((diff / lastMax) * 100).toFixed(
          2
        )} greater than ${EXIT} %`
      );

      const payload = await returnCalldata(price,mockSwapContract,user,false)
      return  payload;
    }
  } else {

    /////  ==== We are NOT in a trade ===================== /////
    ///  *****************************************************  ///
    if (lastMin == 0) {

      await storage.set("lastMin", price.toString());
      console.log("Initiatig Price Entry")

      // do initial transacrion
      const payload = await returnCalldata(price,mockSwapContract,user,true)
      return  payload;
    }

    let diff = price - lastMin;

    if (diff < 0) {
      ///  *****************************************************  ///
      ///  Price is going down, update to new min
      ///  *****************************************************  ///
      console.log(
        `Old lastMin: ${lastMin.toString()}, New lastMin: ${price.toString()}`
      );
      await storage.set("lastMin", price.toString());
      return { canExec: false, message: "No Trade Entry ---> Price Down " };
    } else if (diff == 0) {
      ///  *****************************************************  ///
      ///  Price not moving doing Nothing
      ///  *****************************************************  ///
      return {
        canExec: false,
        message: `No Trade Entry ---> No Price change: ${price.toString()} `,
      };
    } else if (diff / lastMin < ENTRY / 100) {
      ///  *****************************************************  ///
      ///  Price Increate too small, doing Nothing
      ///  *****************************************************  ///
      console.log(
        `Current lastMin: ${lastMin.toString()}, currentPrice: ${price.toString()}`
      );
      return {
        canExec: false,
        message: `No Trade Entry ---> Price Increase too small ${(
          (diff / lastMin) *
          100
        ).toFixed(2)} %`,
      };
    } else {
      ///  *****************************************************  ///
      ///  Price Increate Greater than threshold ---> Enter a TRADE
      ///  *****************************************************  ///

      await storage.set("lastMax", price.toString());

      const payload = await returnCalldata(price,mockSwapContract,user,true)

      return  payload;
    }
  }
});



const returnCalldata = async (price:number,mockSwapContract:Contract,user:string, buy:boolean):Promise<Web3FunctionResult> => {
 
  let priceToPublish = +(price * 10000).toFixed(0);
  console.log(priceToPublish)
  const iface = mockSwapContract.interface;
  let callData = iface.encodeFunctionData("swap", [user, priceToPublish,buy]);
  return {
    canExec: true,
    callData: [
      {
        to: mockSwapContract.address,
        data: callData,
      },
    ],
  };
  

}