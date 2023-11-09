# OpTest <> Gelato Web3 Functions: Simple Trade Strategies
This project showcases how to use Gelato Web3 Functions to implement automatic trading strategies on OpTestnet

### Environment variables

In order to prevent users to leak private keys, this project includes the `dotenv` package which is used to load environment variables. It's used to load the wallet private key, required to run the deploy script.

To use it, rename `.env.example` to `.env` and enter your private key.

```
PK=123cde574ccff....
PROVIDE_URLS=http
```


### Summary

 We implement two simple trading strategies:

a) Trailing Stop:
   We will push up or stop loss if the price goes up.
   When hitting the stop loss, we will exist the trade

b) "Bounce Entry." 
   If we are not in a trade and the price start to move up more than a certain threshold, we will enter the trade



## Demo

We have created a MockSwap contract that do the "fake" swapping between usdc and weth, the contract is deployed on OtTest at [https://blockscout.op-testnet.gelato.digital/address/0x76243f8B81C6C88293B7d522920D408B4061F114/read-contract#address-tabs](https://blockscout.op-testnet.gelato.digital/address/0x76243f8B81C6C88293B7d522920D408B4061F114/read-contract#address-tabs)


The task is live on OpTestnet [here](https://beta.app.gelato.network/functions/task/0xeea10c1fc28af78caa9c349d63db89dc7b2dacca0239f94dbd225963766a689f:42069)


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
> https://beta.app.gelato.network/new-task?cid=QmfDFVSqNGEtJz1QL71tDyFC3xzZhbd4mhLY8jDsgN3bko
```

2) Create the Task:

Clicking on the above link, we will be forwarded to the creating task UI where we will input our user address the Entry and Exit thresholds within the secrets


3) Fund the 1Balance

We will need to fund 1Balance to pay for the transactions. We can do tht deposit gETH on Goerli paying for all of W3F testnet transactions.

<p align="left">
  <img src="https://github.com/gelatodigital/enzyme-poc/blob/master/images/balance.png?raw=true" width="350" title="hover text">
</p>


4)Set the dedicated msg.sender the operator

### Unit testing


```
yarn test
```

```
$ npx hardhat test


  MockSwap
> Current Price: 2028.4773868066882
> No trade
> Initiatig Price Entry
> 20284774
> Current Price: 2028.4773868066882
> Active Trade
> 108 0.36610081662290994
> Trade Exit---> Price Decrease 36.61 greater than 2 %
> 20284774
    ✔ Should run (17716ms)


  1 passing (18s)
```