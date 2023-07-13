//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

struct Pair {
    uint256 usdc;
    uint256 weth;
}

contract MockSwap {
    uint256 constant FACTOR = 10000; 

    mapping(address => Pair) public balanceByUser;
    mapping(address => address) public operatorByUser;

    constructor() {}

    function setOperator(address operator) external {
        operatorByUser[msg.sender] = operator;
    }

    function deposit(address user, uint256 amount) external {
        require(
            msg.sender == user || msg.sender == operatorByUser[user],
            "MockSwap.swap not allowed"
        );

        balanceByUser[user].usdc = balanceByUser[user].usdc + amount;
    }

    function swap(address user, uint256 price, bool buy) external {
        require(
            msg.sender == user || msg.sender == operatorByUser[user],
            "MockSwap.swap not allowed"
        );
        Pair storage userPair = balanceByUser[user];
        require(
            (buy == true && userPair.weth == 0) ||
                (buy == false && userPair.usdc == 0),
            "MockSwap.swap wrong config trade"
        );

        if (buy) {
            userPair.weth = (userPair.usdc * FACTOR) / price;
            userPair.usdc = 0;
        } else {
            userPair.usdc = (userPair.weth * price/FACTOR) + userPair.usdc;
            userPair.weth = 0;
        }
    }
}
