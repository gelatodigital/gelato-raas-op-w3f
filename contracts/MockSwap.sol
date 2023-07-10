//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

struct Pair {
    uint256 eth;
    uint256 weth;
}

contract MockSwap {
    string private greeting;
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

        balanceByUser[user].eth = balanceByUser[user].eth + amount;
    }

    function swap(address user, uint256 price, bool buy) external {
        require(
            msg.sender == user || msg.sender == operatorByUser[user],
            "MockSwap.swap not allowed"
        );
        Pair storage userPair = balanceByUser[user];
        require(
            (buy == true && userPair.weth == 0) ||
                (buy == false && userPair.eth == 0),
            "MockSwap.swap wrong config trade"
        );

        if (buy) {
            userPair.weth = userPair.eth / price;
            userPair.eth = 0;
        } else {
            userPair.eth = userPair.weth * price + userPair.eth;
            userPair.weth = 0;
        }
    }
}
