// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TicketPurchaseContract.sol";
import "./ConversionContract.sol";
import "./StorageContract.sol";
import "./RevenueSharingContract.sol";

contract Controller {

    //Event to log deployment of Contracts 
    event ContractDeployed(string contractName, address contractAddress);
    
    // State variables to store deployed contract addresses
    address public ticketPurchaseContract;
    address public conversionContract;
    address public storageContract;
    address public revenueSharingContract;
    ISwapRouter public swapRouter;

    // Parameters for constructors of other contracts
    address usdt;
    address usdc;
    address rs2;
    address rs3;
    uint128 ps;

    constructor(
        ISwapRouter _swapRouter,
        address _usdt,
        address _usdc,
        address _rs2,
        address _rs3,
        uint128 _ps
    ) {
        swapRouter = ISwapRouter(_swapRouter);
        usdt = _usdt;
        usdc = _usdc;
        rs2 = _rs2;
        rs3 = _rs3;
        ps = _ps;
    }

        // Event to log the funding of the contract
    event ContractFunded(address indexed sender, uint256 amount);

// Function to fund the contract
    function fundContract() external payable {
    require(msg.value > 0, "Invalid amount. Must send more than 0 Ether.");
    emit ContractFunded(msg.sender, msg.value); // Emitting event to track funding
}

    function deployContracts() public {

        
        // Deploy TicketPurchaseContract
        //TicketPurchaseContract _ticketContract = new TicketPurchaseContract(usdt, usdc, address(this));
        //ticketPurchaseContract = address(_ticketContract);
        //Event For Deployment 
        //emit ContractDeployed("ticketPurchaseContract", address(_ticketContract));

        // Deploy ConversionContract
        ConversionContract _conversionContract = new ConversionContract(address(swapRouter), address(this), usdt, usdc, storageContract);
        conversionContract = address(_conversionContract);
        //Event For Deployment
        emit ContractDeployed("ConversionContract", address(_conversionContract));

        // Deploy StorageContract
        StorageContract _storageContract = new StorageContract();
        storageContract = address(_storageContract);
        //Event For depoloyment
        emit ContractDeployed("storageContract", address(_storageContract));


        // Deploy RevenueSharingContract
        RevenueSharingContract _revenueContract = new RevenueSharingContract(rs2, rs3, ps);
        revenueSharingContract = address(_revenueContract);
        // Emit event for contract deployment
        emit ContractDeployed("RevenueSharingContract", address(_revenueContract));


        // Dynamic settings for contract init
        //_ticketContract.initializeController(address(this));
        _conversionContract.setStorageContract(storageContract);
        _storageContract.initializeController(address(this));

        // Logic to handle any ownership transfers can be added here
    }
}