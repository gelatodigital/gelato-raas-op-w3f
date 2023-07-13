# zkSync <> Gelato Web3 Functions Workshop : Simple Trade Strategies


### Environment variables

In order to prevent users to leak private keys, this project includes the `dotenv` package which is used to load environment variables. It's used to load the wallet private key, required to run the deploy script.

To use it, rename `.env.example` to `.env` and enter your private key.

```
WALLET_PRIVATE_KEY=123cde574ccff....
PROVIDE_URLS=http
```


### Summary

This project showcases how to use Gelato Web3 Functions to implement automatic trading strategies in zkSync

 We implement two simple trading strategies:

a) Trailing Stop:
   We will push up or stop loss if the price goes up.
   When hitting the stop loss, we will exist the trade

b) "Bounce Entry." 
   If we are not in a trade and the price start to move up more than a certain threshold, we will enter the trade



## Demo

We have created a MockSwap contract that do the "fake" swapping between usdc and weth, the contract is deployed on zkSync Mainnet at [https://explorer.zksync.io/address/0x5e78ba86fd2E56d94c13334cD17FBD9Bb16838e0#transactions](https://explorer.zksync.io/address/0x5e78ba86fd2E56d94c13334cD17FBD9Bb16838e0#transactions)


The task is live on zkSync [here](https://beta.app.gelato.network/task/0xa506fc8b0bd6dfae281637c37eed7956a083b0f3fcebf462297e051c8d87d4be?chainId=324)


### Steps to step the web3 function

1) Deploy the web3 function code to IPFS:

```
npx w3f deploy web3-functions/trade/index.ts
```
And be will get:
```
 ✓ Web3Function deployed to ipfs.
 ✓ CID: QmTu44n9N4aMFRSh8255qnKtc1b4izphY1stBrA8Agn2g9

To create a task that runs your Web3 Function every minute, visit:
> https://beta.app.gelato.network/new-task?cid=QmTu44n9N4aMFRSh8255qnKtc1b4izphY1stBrA8Agn2g9
```

2) Create the Task:

Clicking on the above link, we will be forwarded to the creating task UI where we will input our user address the Entry and Exit thresholds within the secrets


3) Fund the 1Balance

We will need to fund 1Balance to pay for the transactions. For the time being, we fund 1balance depositing USDC on Polygon

<p align="left">
  <img src="https://github.com/gelatodigital/enzyme-poc/blob/master/images/balance.png?raw=true" width="350" title="hover text">
</p>


4)Set the dedicated msg.sender the operator

### Unit testing

In order to be able to run the unit testing please follow the steps in [https://era.zksync.io/docs/tools/hardhat/testing.html](https://era.zksync.io/docs/tools/hardhat/testing.html)

and then simply:

```
yarn test
```

```
$ NODE_ENV=test hardhat test --network zkSync


  MockSwap
> Current Price: 1886.7936815401163
> No trade
> Initiatig Price Entry
> 18867937
> Current Price: 1886.7936815401163
> Active Trade
> Trade Exit---> Price Decrease 63.72 greater than NaN %
> 18867937
    ✔ Should run (10675ms)


  1 passing (11s)
```