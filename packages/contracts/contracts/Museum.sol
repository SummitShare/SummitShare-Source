// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* Category: Smart Contract
   Purpose: Acts as the central hub for curating exhibits and managing event logistics, including ticket sales and participant access. */

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ExhibitNFT.sol";

contract Museum is Ownable {
    IERC20 public usdcToken;
    mapping(string => ExhibitNFT) public exhibits;

    event ExhibitCurated(
        address museumAddress,
        string exhibitId,
        address exhibitAddress
    );
    event TicketPurchased(address buyer, address exhibit, uint256 tokenId);
    // emmit an event with the contract address, token address, and owner address
    event MuseumCreated(
        address museumAddress,
        address tokenAddress,
        address ownerAddress
    );

    constructor(IERC20 _usdcToken) Ownable(msg.sender) {
        usdcToken = _usdcToken;
        // emmit an event with the contract address, token address, and owner address
        emit MuseumCreated(address(this), address(usdcToken), owner());
    }

    /**
     * @dev Curates a new exhibit.
     * @param exhibitId The unique identifier for the exhibit.
     * @param exhibit The ExhibitNFT contract for the exhibit.
     */
    function curateExhibit(
        string memory exhibitId,
        ExhibitNFT exhibit
    ) external onlyOwner {
        exhibits[exhibitId] = exhibit;

        emit ExhibitCurated(address(this), exhibitId, address(exhibit));
    }

    /**
     * @dev Purchases a ticket for an exhibit.
     * @param exhibitId The unique identifier for the exhibit.
     * @param usdcAmount The amount of USDC sent to purchase the ticket.
     */
    function purchaseTicket(
        string memory exhibitId,
        uint256 usdcAmount
    ) external {
        ExhibitNFT exhibit = exhibits[exhibitId];
        require(address(exhibit) != address(0), "Exhibit does not exist.");

        uint256 ticketPrice = exhibit.ticketPrice();
        require(usdcAmount >= ticketPrice, "Insufficient USDC sent.");

        // Transfer the USDC directly from the buyer to the ExhibitNFT's escrow
        address escrowAddress = address(exhibit.escrow());
        require(usdcToken.transferFrom(msg.sender, escrowAddress, ticketPrice));
        // Mint the ticket to the buyer
        uint256 tokenId = exhibit.mintTicket(msg.sender);

        emit TicketPurchased(msg.sender, address(exhibit), tokenId);
    }

    function verifyTicketOwnership(
        string memory exhibitId,
        address user
    ) external view returns (bool) {
        ExhibitNFT exhibit = exhibits[exhibitId];
        return exhibit.balanceOf(user) > 0;
    }
}
