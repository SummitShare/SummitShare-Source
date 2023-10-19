// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MUSDC is ERC20 {
    constructor(uint256 initialSupply) ERC20("USDC Mock", "USDCM") {
        _mint(msg.sender, initialSupply);
    }
}
