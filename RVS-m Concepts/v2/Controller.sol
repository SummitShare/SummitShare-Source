// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./TicketPurchaseContract.sol";
import "./ConversionContract.sol";
import "./StorageContract.sol";
import "./RevenueSharingContract.sol";

contract Controller {

    
    // State variables to store deployed contract addresses
    address public ticketPurchaseContract;
    address public conversionContract;
    address public storageContract;
    address public revenueSharingContract;

    // Parameters for constructors of other contracts
    address uniswapRouter;
    address usdt;
    address usdc;
    address rs2;
    address rs3;
    uint128 ps;

    constructor(
        address _uniswapRouter,
        address _usdt,
        address _usdc,
        address _rs2,
        address _rs3,
        uint128 _ps
    ) {
        uniswapRouter = _uniswapRouter;
        usdt = _usdt;
        usdc = _usdc;
        rs2 = _rs2;
        rs3 = _rs3;
        ps = _ps;
    }

    function deployContracts() public {
        // Deploy TicketPurchaseContract
        TicketPurchaseContract _ticketContract = new TicketPurchaseContract(uniswapRouter, usdt, usdc);

        // Deploy ConversionContract
        ConversionContract _conversionContract = new ConversionContract(uniswapRouter, address(this), usdt, usdc, storageContract);

        // Deploy StorageContract
        StorageContract _storageContract = new StorageContract();

        // Deploy RevenueSharingContract
        RevenueSharingContract _revenueContract = new RevenueSharingContract(rs2, rs3, ps);

        // Assign the deployed contracts to variables
        ticketPurchaseContract = address(_ticketContract);
        conversionContract = address(_conversionContract);
        storageContract = address(_storageContract);
        revenueSharingContract = address(_revenueContract);

        // Dynamic settings for contract init
        _ticketContract.initializeController(address(this));
        _conversionContract.setStorageContract(storageContract);
        _storageContract.initializeController(address(this));

        // Logic to handle any ownership transfers can be added here
    }
}
