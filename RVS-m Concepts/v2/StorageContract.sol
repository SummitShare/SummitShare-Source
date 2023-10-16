// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RevenueSharingContract.sol";
contract StorageContract {
    address public controller;
    address public revenueSharingContract;
    address public usdc;
    uint256 public threshold = 100 * 10 ** 6;  // 100 USDC with 6 decimal places
    event ContractFunded(address indexed funder, uint256 amount);
    event FundsSentToRevenueSharing(uint256 amount);

    
    modifier onlyController() {
        require(msg.sender == controller, "Only the controller can perform this action.");
        _;
    }

    function initializeController(address _controller) external {
        require(controller == address(0), "Controller has already been set.");
        controller = _controller;
    }

    function setContracts(address _revenueSharingContract, address _usdc) external onlyController {
        revenueSharingContract = _revenueSharingContract;
        usdc = _usdc;
    }

    function setThreshold(uint256 newThreshold) external onlyController {
        threshold = newThreshold;
    }

    function fundContract(uint256 amount) external {
        require(IERC20(usdc).transferFrom(msg.sender, address(this), amount), "USDC transfer failed.");
        emit ContractFunded(msg.sender, amount);
        
        uint256 contractBalance = IERC20(usdc).balanceOf(address(this));
        if (contractBalance >= threshold) {
            require(IERC20(usdc).approve(revenueSharingContract, contractBalance), "USDC approval to RevenueSharingContract failed.");
            RevenueSharingContract(revenueSharingContract).distributeFunds(contractBalance);
            emit FundsSentToRevenueSharing(contractBalance);
        }
    }
}
