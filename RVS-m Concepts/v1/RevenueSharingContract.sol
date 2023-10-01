// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RevenueSharingContract is ReentrancyGuard {
    address public controller;
    address payable public rs2;
    address payable public rs3;
    uint128 public ps;

    // Events
    event FundsDistributed(uint256 rs2Share, uint256 rs3Share);

    constructor(address payable _rs2, address payable _rs3, uint128 _ps) payable {
        rs2 = _rs2;
        rs3 = _rs3;
        ps = _ps;
    }

    function initialize(address _controller) external {
        require(controller == address(0), "Already initialized");
        require(_controller != address(0), "Invalid controller address");
        controller = _controller;
    }

    modifier onlyController() {
        require(msg.sender == controller, "Only the controller can perform this action.");
        _;
    }
    
    function distributeFunds(IERC20 token) external onlyController nonReentrant {
        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance > 0, "No funds available to distribute.");

        uint256 rs2Share = (contractBalance * ps) / 100;
        uint256 rs3Share = contractBalance - rs2Share;

        token.transfer(rs2, rs2Share);
        token.transfer(rs3, rs3Share);

        emit FundsDistributed(rs2Share, rs3Share);
    }

    // Additional functionalities can be added here
    // ...
}
