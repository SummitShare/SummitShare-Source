// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ExhibitNFT.sol";

contract Museum is Ownable {
    IERC20 public usdcToken;
    mapping(string => ExhibitNFT) public exhibits;

    event ExhibitCurated(string exhibitId);
    event TicketPurchased(address buyer, string exhibitId, uint256 tokenId);

    constructor(IERC20 _usdcToken) Ownable(msg.sender) {
        usdcToken = _usdcToken;
    }

    function curateExhibit(
        string memory exhibitId,
        ExhibitNFT exhibit
    ) external onlyOwner {
        exhibits[exhibitId] = exhibit;
        emit ExhibitCurated(exhibitId);
    }

    function purchaseTicket(string memory exhibitId, uint256 usdcAmount) external {
        ExhibitNFT exhibit = exhibits[exhibitId];
        require(address(exhibit) != address(0), "Exhibit does not exist.");

        uint256 ticketPrice = exhibit.ticketPrice();
        require(usdcAmount >= ticketPrice, "Insufficient USDC sent.");

        // Transfer the USDC directly from the buyer to the ExhibitNFT's escrow
        address escrowAddress = address(exhibit.escrow());
        usdcToken.transferFrom(msg.sender, escrowAddress, ticketPrice);
        // Mint the ticket to the buyer
        uint256 tokenId = exhibit.mintTicket(msg.sender);

        emit TicketPurchased(msg.sender, exhibitId, tokenId);
    }

    function verifyTicketOwnership(
        string memory exhibitId,
        address user
    ) external view returns (bool) {
        ExhibitNFT exhibit = exhibits[exhibitId];
        return exhibit.balanceOf(user) > 0;
    }
}
