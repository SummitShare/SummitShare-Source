// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RevenueSharingContract is ReentrancyGuard {
    address public controller;
    address public rs2;
    address public rs3;
    uint128 public ps;
    address public usdc;
    event FundsDistributed(uint256 rs2Share, uint256 rs3Share);
    
    modifier onlyController() {
        require(msg.sender == controller, "Only the controller can perform this action.");
        _;
    }

    constructor(
    address _rs2, 
    address _rs3, 
    uint128 _ps
){}



    function initialize(address _controller, address _rs2, address _rs3, uint128 _ps, address _usdc) external {
        require(controller == address(0), "Controller has already been set.");
        require(_rs2 != address(0) && _rs3 != address(0), "Invalid participant addresses.");
        require(_ps > 0 && _ps <= 100, "Percentage share should be between 1 and 100.");
        
        controller = _controller;
        rs2 = _rs2;
        rs3 = _rs3;
        ps = _ps;
        usdc = _usdc;
    }

    function distributeFunds(uint256 amount) external nonReentrant onlyController {
        uint256 contractBalance = IERC20(usdc).balanceOf(msg.sender);
        require(contractBalance >= amount, "Insufficient funds to distribute.");

        uint256 rs2Share = (amount * ps) / 100;
        uint256 rs3Share = amount - rs2Share;

        require(IERC20(usdc).transferFrom(msg.sender, rs2, rs2Share), "Failed to distribute to rs2.");
        require(IERC20(usdc).transferFrom(msg.sender, rs3, rs3Share), "Failed to distribute to rs3.");
        emit FundsDistributed(rs2Share, rs3Share);
    }
}
