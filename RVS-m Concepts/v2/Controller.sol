// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./TicketPurchaseContract.sol";
import "./ConversionContract.sol";
import "./StorageContract.sol";
import "./RevenueSharingContract.sol";

contract Controller {
    address public ticketPurchaseContract;
    address public conversionContract;
    address public storageContract;
    address public revenueSharingContract;

    constructor(
        address _uniswapRouter,
        address _usdt,
        address _usdc,
        address payable _rs2,
        address payable _rs3
    ) {
        // Deploy other contracts and set addresses
        TicketPurchaseContract _ticketContract = new TicketPurchaseContract();
        ConversionContract _conversionContract = new ConversionContract(_uniswapRouter, address(this), _usdt, _usdc, address(0));
        StorageContract _storageContract = new StorageContract();
        RevenueSharingContract _revenueContract = new RevenueSharingContract(_rs2, _rs3, 50);

        // Assign the deployed contracts to varaibles
        ticketPurchaseContract = address(_ticketContract);
        conversionContract = address(_conversionContract);
        storageContract = address(_storageContract);
        revenueSharingContract = address(_revenueContract);

        //  dynamic settings for contract init
        _ticketContract.initializeController(address(this));
        _conversionContract.setStorageContract(storageContract);
        _storageContract.initializeController(address(this), revenueSharingContract);

        //  logic to handle any ownership transfers can be added here
    }
    
    //  functions for the complete flow can go here.
}
