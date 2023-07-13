// web3-functions/trade/index.ts
import {
  Web3Function
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "ethers";

// web3-functions/trade/uniswap-quote.ts
import { ethers as ethers2 } from "ethers";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

// web3-functions/trade/conversion.ts
import { ethers } from "ethers";
function fromReadableAmount(amount, decimals) {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}

// web3-functions/trade/uniswap-quote.ts
import { ChainId, Token } from "@uniswap/sdk-core";
var POOL_FACTORY_CONTRACT_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
var QUOTER_CONTRACT_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
var WETH_ADDRESS = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
var USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
var WETH_TOKEN = new Token(ChainId.POLYGON, WETH_ADDRESS, 18, "WETH", "Wrapped Ether");
var USDC_TOKEN = new Token(ChainId.POLYGON, USDC_ADDRESS, 6, "USDC", "USD//C");
var tokens = {
  in: USDC_TOKEN,
  amountIn: 1e3,
  out: WETH_TOKEN,
  poolFee: FeeAmount.MEDIUM
};
async function uniswapQuote(provider) {
  const quoterContract = new ethers2.Contract(QUOTER_CONTRACT_ADDRESS, Quoter.abi, provider);
  const poolConstants = await getPoolConstants(provider);
  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstants.token0,
    poolConstants.token1,
    poolConstants.fee,
    fromReadableAmount(tokens.amountIn, tokens.in.decimals).toString(),
    0
  );
  return 1e3 * 10 ** 18 / +quotedAmountOut.toString();
}
async function getPoolConstants(provider) {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokens.in,
    tokenB: tokens.out,
    fee: tokens.poolFee
  });
  const poolContract = new ethers2.Contract(currentPoolAddress, IUniswapV3PoolABI.abi, provider);
  const [token0, token1, fee] = await Promise.all([poolContract.token0(), poolContract.token1(), poolContract.fee()]);
  return {
    token0,
    token1,
    fee
  };
}

// web3-functions/trade/abi.ts
var MockSwapAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceByUser",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "usdc",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "weth",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "operatorByUser",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "setOperator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "buy",
        "type": "bool"
      }
    ],
    "name": "swap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// web3-functions/trade/index.ts
Web3Function.onRun(async (context) => {
  const { userArgs, storage, secrets, multiChainProvider } = context;
  const provider = multiChainProvider.default();
  const POLYGON_PROVIDER = multiChainProvider.chainId(137);
  const user = userArgs.user;
  const MOCK_SWAP_ADDRESS = userArgs.contract;
  const lastMin = +(await storage.get("lastMin") ?? "0");
  const lastMax = +(await storage.get("lastMax") ?? "0");
  const ENTRY = +await secrets.get("ENTRY");
  const EXIT = +await secrets.get("EXIT");
  const mockSwapContract = new Contract(
    MOCK_SWAP_ADDRESS,
    MockSwapAbi,
    provider
  );
  let userBalance = await mockSwapContract.balanceByUser(user);
  let wethBalance = +userBalance.weth.toString();
  let usdcbalance = +userBalance.usdc.toString();
  let price = await uniswapQuote(POLYGON_PROVIDER);
  console.log(`Current Price: ${price}`);
  const activeTrade = wethBalance == 0 ? false : true;
  console.log(activeTrade ? "Active Trade" : "No trade");
  if (activeTrade) {
    if (lastMax == 0) {
      await storage.set("lastMax", price.toString());
      return { canExec: false, message: "Initiatig Price Exit" };
    }
    let diff = lastMax - price;
    if (diff < 0) {
      await storage.set("lastMax", price.toString());
      console.log(
        `Old lastMax: ${lastMax.toString()}, New lastMax: ${price.toString()}`
      );
      return { canExec: false, message: "No Trade Exit ---> Price UP " };
    } else if (diff == 0) {
      return {
        canExec: false,
        message: `No Trade Exit ---> No Price change: ${price.toString()} `
      };
    } else if (diff / lastMax < EXIT / 100) {
      console.log(
        `Current lastMax: ${lastMax.toString()}, currentPrice: ${price.toString()}`
      );
      return {
        canExec: false,
        message: `No Trade Exit ---> Price decrease Small ${(diff / lastMax * 100).toFixed(2)} %`
      };
    } else {
      await storage.set("lastMin", price.toString());
      console.log(
        `Trade Exit---> Price Decrease ${(diff / lastMax * 100).toFixed(
          2
        )} greater than ${EXIT} %`
      );
      const payload = await returnCalldata(price, mockSwapContract, user, false);
      return payload;
    }
  } else {
    if (lastMin == 0) {
      await storage.set("lastMin", price.toString());
      console.log("Initiatig Price Entry");
      const payload = await returnCalldata(price, mockSwapContract, user, true);
      return payload;
    }
    let diff = price - lastMin;
    if (diff < 0) {
      console.log(
        `Old lastMin: ${lastMin.toString()}, New lastMin: ${price.toString()}`
      );
      await storage.set("lastMin", price.toString());
      return { canExec: false, message: "No Trade Entry ---> Price Down " };
    } else if (diff == 0) {
      return {
        canExec: false,
        message: `No Trade Entry ---> No Price change: ${price.toString()} `
      };
    } else if (diff / lastMin < ENTRY / 100) {
      console.log(
        `Current lastMin: ${lastMin.toString()}, currentPrice: ${price.toString()}`
      );
      return {
        canExec: false,
        message: `No Trade Entry ---> Price Increase too small ${(diff / lastMin * 100).toFixed(2)} %`
      };
    } else {
      await storage.set("lastMax", price.toString());
      const payload = await returnCalldata(price, mockSwapContract, user, true);
      return payload;
    }
  }
});
var returnCalldata = async (price, mockSwapContract, user, buy) => {
  let priceToPublish = +(price * 1e4).toFixed(0);
  console.log(priceToPublish);
  const iface = mockSwapContract.interface;
  let callData = iface.encodeFunctionData("swap", [user, priceToPublish, buy]);
  return {
    canExec: true,
    callData: [
      {
        to: mockSwapContract.address,
        data: callData
      }
    ]
  };
};
