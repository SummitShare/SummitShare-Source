// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* Category: Smart Contract
   Purpose: Manages the organization and deployment of exhibits for events, integrating with the Museum contract and handling ArtifactNFTs. */

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ArtifactNFT is ERC721A, Ownable {
    string private baseURI;

    event Minted(address to, uint256 quantity);

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner,
        string memory _baseURI
    ) ERC721A(_name, _symbol) Ownable(_owner) {
        baseURI = _baseURI;
    }

    function mint(address to, uint256 quantity) external onlyOwner returns (uint256) {
        _mint(to, quantity);
        emit Minted(to, quantity);
    }


    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

       function tokenURI(uint256 tokenId) public view override returns (string memory) {
        //require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        // Concatenate the baseURI, tokenId, and ".json" to form the full URI
        return string(abi.encodePacked(_baseURI(), Strings.toString(tokenId), ".json"));
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }
}
