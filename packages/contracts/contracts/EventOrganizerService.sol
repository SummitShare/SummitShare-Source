// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Museum.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventOrganizerService is Ownable{
    Museum public museum;
    IERC20 public usdcToken;
    mapping(string => ExhibitNFT) public exhibits;

    event ExhibitOrganized(string exhibitId, address exhibitAddress, address escrowAddress);

    constructor(Museum _museum, IERC20 _usdcToken) Ownable(msg.sender) {
        museum = _museum;
        usdcToken = _usdcToken;
    }

    function organizeExhibit(
        string memory exhibitId, 
        string memory name, 
        string memory symbol, 
        uint256 ticketPrice, 
        address[] memory beneficiaries, 
        uint256[] memory shares
    ) public {
        require(address(museum.exhibits(exhibitId)) == address(0), "ExhibitID already taken.");
        
        EventEscrow newEscrow = new EventEscrow(usdcToken, beneficiaries, shares);
        ExhibitNFT newExhibit = new ExhibitNFT(name, symbol, ticketPrice, newEscrow, address(museum));
        exhibits[exhibitId] = newExhibit;
        emit ExhibitOrganized(exhibitId, address(newExhibit), address(newEscrow));
    }
}
