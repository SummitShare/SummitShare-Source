//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./TicketPurchase.sol";
import "./StorageContract.sol";
import "./TokenConversionContract.sol";
import "./RevenueSharingContract.sol";

contract Controller {
    address public owner;
    address public ticketPurchaseContract;
    address public storageContract;
    address public tokenConversionContract;
    address public revenueSharingContract;
    address public usdt;
    address public usdc;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    constructor(address _usdt, address _usdc, address payable _rs2, address payable _rs3, uint128 _ps) {
        usdt = _usdt;
        usdc = _usdc;
        owner = msg.sender;

        // Automatically deploy the contracts
        deployStorageContract();
        deployTokenConversionContract();
        deployTicketPurchase();
        deployRevenueSharingContract(_rs2, _rs3, _ps);
    }

    function deployTicketPurchase() internal {
        TicketPurchase tp = new TicketPurchase(usdt, usdc, storageContract, tokenConversionContract, address(this));
        ticketPurchaseContract = address(tp);
    }

    function deployStorageContract() internal {
        StorageContract sc = new StorageContract(usdc, address(this));
        storageContract = address(sc);
    }

    function deployTokenConversionContract() internal {
        TokenConversionContract tc = new TokenConversionContract(usdt, usdc, storageContract);
        tokenConversionContract = address(tc);
    }

    function deployRevenueSharingContract(address payable _rs2, address payable _rs3, uint128 _ps) internal {
        RevenueSharingContract rvs = new RevenueSharingContract(_rs2, _rs3, _ps);
        rvs.initialize(address(this));  // Initialize with the Controller as owner
        revenueSharingContract = address(rvs);
    }

    // Logic to decide where to send tokens based on the type (USDT or USDC)
    function routeFunds(address token, uint256 amount) external {
        require(msg.sender == ticketPurchaseContract, "Unauthorized");
        if (token == usdc) {
            // Directly send to Storage Contract
            StorageContract(storageContract).storeFunds(amount);
        } else if (token == usdt) {
            // Send to Token Conversion Contract
            TokenConversionContract(tokenConversionContract).convertAndStore(amount);
        }
    }
}
