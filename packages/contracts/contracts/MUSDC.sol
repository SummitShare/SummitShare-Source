// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/* Category: Smart Contract
   Purpose: Provides a mock or utility contract for USDC operations, enabling financial transaction simulations or specific platform functionalities. */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MUSDC is ERC20 {
    constructor(uint256 _initialSupply) ERC20("USDC Mock", "USDCM") {
        _mint(msg.sender, _initialSupply);
    }
}
