// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./EventEscrow.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ExhibitNFT is ERC721, Ownable {
  uint256 public ticketPrice;
  EventEscrow public escrow;
  uint256 private totalMinted;
  
  event TicketMinted(address to, uint256 tokenId);



  constructor(
    string memory name,
    string memory symbol,
    uint256 _ticketPrice,
    EventEscrow _escrow,
    address _owner
  ) ERC721(name, symbol) Ownable(_owner) {
    ticketPrice = _ticketPrice;
    escrow = _escrow;
    totalMinted = 0;
  }

  function mintTicket(address to) external onlyOwner returns (uint256) {
    uint256 tokenId = totalMinted;
    totalMinted++;
    _safeMint(to, tokenId);
    emit TicketMinted(to, tokenId);
    return tokenId;
  }
}
