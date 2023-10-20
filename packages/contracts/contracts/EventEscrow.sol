// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EventEscrow {
    IERC20 public usdcToken;
    mapping(address => uint256) public payouts;
    address[] public beneficiaries;
    uint256 public totalShares;

    modifier onlyBeneficiary() {
        require(payouts[msg.sender] > 0, "Not a beneficiary");
        _;
    }

    event PaymentDistributed(address beneficiary, uint256 amount);

    constructor(IERC20 _usdcToken, address[] memory _beneficiaries, uint256[] memory shares) {
        require(_beneficiaries.length == shares.length, "Mismatched beneficiaries and shares.");
        usdcToken = _usdcToken;
        beneficiaries = _beneficiaries;
        
        for (uint i = 0; i < _beneficiaries.length; i++) {
            payouts[_beneficiaries[i]] = shares[i];
            totalShares += shares[i];
        }
    }

    function distributePayments() external onlyBeneficiary {
        uint256 totalAmount = usdcToken.balanceOf(address(this));
        require(totalAmount > 0, "No funds to distribute.");
        
        for (uint i = 0; i < beneficiaries.length; i++) {
            address beneficiary = beneficiaries[i];
            uint256 payment = (totalAmount * payouts[beneficiary]) / totalShares;
            usdcToken.transfer(beneficiary, payment);
            emit PaymentDistributed(beneficiary, payment);
        }
    }
}