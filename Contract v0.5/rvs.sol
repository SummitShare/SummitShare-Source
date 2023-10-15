// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // Importing ReentrancyGuard for additional security

contract RevenueSharingContract is ReentrancyGuard {
    // Variables
    address payable public rs1;
    address payable public rs2;
    address payable public rs3;
    uint128 public ps;
    bool public fundsDistributed;
    uint256 public constant MAX_RECEIVE_AMOUNT = 11 ether;

    // Events
    event FundsDistributed(uint256 rs2Share, uint256 rs3Share);
    event ContractFunded(address sender, uint256 amount);
    event RemainingBalanceReturned(address recipient, uint256 amount);

    // Constructor
    constructor(address payable _rs2, address payable _rs3, uint128 _ps) payable {
        require(_rs2 != address(0) && _rs3 != address(0), "Invalid participant addresses.");
        require(_ps > 0 && _ps <= 100, "Percentage share should be between 1 and 100.");

        rs1 = payable(msg.sender);
        rs2 = _rs2;
        rs3 = _rs3;
        ps = _ps;
    }

    // Modifier to ensure only the contract owner can perform certain actions
    modifier onlyOwner() {
        require(msg.sender == rs1, "Only the contract owner can perform this action.");
        _;
    }

    // Modifier to ensure funds are not distributed more than once
    modifier fundsNotDistributed() {
        require(!fundsDistributed, "Funds have already been distributed.");
        _;
    }

    // Combined funding function, optimized by merging functionality of receive() and fundContractBalance()
    function fundContract() external payable {
        require(msg.value > 0 && msg.value <= MAX_RECEIVE_AMOUNT, "Invalid amount. You can send up to 11 Ether.");
        emit ContractFunded(msg.sender, msg.value); // Emitting event to track funding
    }

    // Distribute funds function
    function distributeFunds() external onlyOwner fundsNotDistributed nonReentrant { // Using OpenZeppelin's nonReentrant modifier
        require(address(this).balance > 0, "No funds available to distribute.");

        uint256 contractBalance = address(this).balance;
        uint256 rs2Share = (contractBalance * ps) / 100;
        uint256 rs3Share = contractBalance - rs2Share;

        fundsDistributed = true;

        // Transfer funds
        rs2.transfer(rs2Share);
        rs3.transfer(rs3Share);

        // Send remaining balance back to rs1 - handles rounding errors by returning any leftover balance
        uint256 remainingBalance = address(this).balance;
        if (remainingBalance > 0) {
            rs1.transfer(remainingBalance);
            emit RemainingBalanceReturned(rs1, remainingBalance); // Emitting event to track remaining balance transfer
        }

        emit FundsDistributed(rs2Share, rs3Share); // Emitting event to track distribution
    }

    // Function to check the balance of the contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Fallback function to allow owner to recover any stuck funds
    function recoverStuckFunds() external payable onlyOwner {
        require(address(this).balance > 0, "No funds to recover.");
        rs1.transfer(address(this).balance);
    }
}
