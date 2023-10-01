// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Controller.sol";  // Importing the Controller contract

contract TicketPurchase {
    address public usdt;
    address public usdc;
    address public storageContract;
    address public tokenConversionContract;
    address public controller;

    event TransactionSuccess(address indexed buyer, uint256 amount, uint256 code);
    event TransactionFailure(address indexed buyer, uint256 code);

    constructor(
        address _usdt,
        address _usdc,
        address _storageContract,
        address _tokenConversionContract,
        address _controller
    ) {
        usdt = _usdt;
        usdc = _usdc;
        storageContract = _storageContract;
        tokenConversionContract = _tokenConversionContract;
        controller = _controller;
    }

    function buyTicket(uint256 amount, address token) external {
        require(token == usdt || token == usdc, "Invalid token");

        IERC20 paymentToken = IERC20(token);

        // Transfer the approved tokens from the user to this contract
        require(
            paymentToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        // Mint the ticket here (or whatever other logic you require)

        // Route the funds through Controller
        Controller(controller).routeFunds(token, amount);

        // Emit event for successful transaction
        emit TransactionSuccess(msg.sender, amount, 200);
    }

   
    function handleError() internal {
        emit TransactionFailure(msg.sender, 400);
        // Additional logic for error handling
    }
}


//OFFCHAIN UUID GENERATOR SCRIPTS
