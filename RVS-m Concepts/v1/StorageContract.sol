// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract StorageContract is ReentrancyGuard {
    address public controller;
    address public usdc;
    uint256 public threshold;
    address public revenueSharingContract;

    event FundsReceived(address indexed sender, uint256 amount);
    event FundsTransferredToRVS(uint256 amount);
    event ControllerUpdated(address newController);
    event ThresholdUpdated(uint256 newThreshold);

    constructor(
        address _controller, 
        address _usdc, 
        uint256 _threshold, 
        address _revenueSharingContract
    ) {
        controller = _controller;
        usdc = _usdc;
        threshold = _threshold;
        revenueSharingContract = _revenueSharingContract;
    }

    modifier onlyController() {
        require(msg.sender == controller, "Only the controller can perform this action.");
        _;
    }

    function updateController(address newController) external onlyController {
        require(newController != address(0), "New controller cannot be the zero address");
        controller = newController;
        emit ControllerUpdated(newController);
    }

    function updateThreshold(uint256 newThreshold) external onlyController {
        require(newThreshold > 0, "New threshold must be greater than zero");
        threshold = newThreshold;
        emit ThresholdUpdated(newThreshold);
    }

    function storeFunds(uint256 amount) external onlyController {
        IERC20(usdc).transferFrom(msg.sender, address(this), amount);
        emit FundsReceived(msg.sender, amount);
        
        // Check if threshold is reached and if so, transfer to RVS
        checkThreshold();
    }

    function checkThreshold() public {
        uint256 contractBalance = IERC20(usdc).balanceOf(address(this));
        if(contractBalance >= threshold) {
            fundRVS();
        }
    }

    function fundRVS() internal {
        IERC20 usdcToken = IERC20(usdc);
        uint256 amount = usdcToken.balanceOf(address(this));
        require(amount > 0, "No funds to transfer");

        require(usdcToken.approve(address(revenueSharingContract), amount), "Token approval failed");

        // You'll need to use an interface or cast revenueSharingContract to the contract type that has fundContract
        // Like so: YourRevenueSharingContractInterface(revenueSharingContract).fundContract(amount);
        emit FundsTransferredToRVS(amount);
    }
}
