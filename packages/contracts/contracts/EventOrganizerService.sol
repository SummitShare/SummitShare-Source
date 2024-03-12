// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* Category: Smart Contract
   Purpose: Manages the organization and deployment of exhibits for events, integrating with the Museum contract and handling ArtifactNFTs. */

import "./Museum.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ArtifactNFT.sol";

contract EventOrganizerService is Ownable {
    Museum public museum;
    IERC20 public usdcToken;
    mapping(string => address) public exhibits;

    event ExhibitNFTDeployed(
        string exhibitId,
        address indexed exhibitNFTAddress,
        address indexed escrowAddress,
        address indexed museumAddress
    );
    event ArtifactNFTDeployed(
        address indexed artifactNFTAddress,
        string name,
        string symbol,
        address indexed ownerAddress,
        string baseURI
    );

    constructor(Museum _museum, IERC20 _usdcToken) Ownable(msg.sender) {
        museum = _museum;
        usdcToken = _usdcToken;
    }

    /**
     * @dev Deploys a new ArtifactNFT.
     * @param name The name of the artifact.
     * @param symbol The symbol of the artifact.
     * @param owner The owner of the artifact.
     * @param baseURI The base URI for the artifact's NFT metadata.
     */
    function deployArtifactNFT(
        string memory name,
        string memory symbol,
        address owner,
        string memory baseURI
    ) public {
        // Create a new ArtifactNFT contract for the artifact
        ArtifactNFT newArtifact = new ArtifactNFT(name, symbol, owner, baseURI);
        // Emit an event to signal that the new ArtifactNFT contract has been deployed
        emit ArtifactNFTDeployed(
            address(newArtifact),
            name,
            symbol,
            owner,
            baseURI
        );
    }

    /**
     * @dev Organizes a new exhibit.
     * @param exhibitId The unique identifier for the exhibit.
     * @param name The name of the exhibit.
     * @param symbol The symbol of the exhibit.
     * @param ticketPrice The price of the ticket for the exhibit.
     * @param beneficiaries The addresses of the beneficiaries who will receive revenue from the exhibit.
     * @param shares The shares of the revenue that each beneficiary will receive.
     * @param baseURI The base URI for the exhibit's NFT metadata.
     * @param location The location of the exhibit.
     * @param artifactNFTAddress The address of the ArtifactNFT contract.
     * @param details The collection that the exhibit belongs to.
     */
    function organizeExhibit(
        string memory name,
        string memory symbol,
        uint256 ticketPrice,
        address[] memory beneficiaries,
        uint256[] memory shares,
        string calldata baseURI,
        string memory location,
        address artifactNFTAddress,
        string memory details,
        string memory exhibitId
    ) public {
        // Ensure that the exhibit ID has not already been taken
        require(
            address(museum.exhibits(exhibitId)) == address(0),
            "ExhibitID already taken."
        );

        // Create a new escrow contract for the exhibit
        EventEscrow newEscrow = new EventEscrow(
            usdcToken,
            beneficiaries,
            shares
        );

        ExhibitNFT newExhibit = new ExhibitNFT(
            name,
            symbol,
            ticketPrice,
            newEscrow,
            address(museum),
            baseURI,
            location,
            artifactNFTAddress,
            details
        );
        exhibits[exhibitId] = address(newExhibit);

        emit ExhibitNFTDeployed(
            exhibitId,
            address(newExhibit),
            address(newEscrow),
            address(museum)
        );
    }

    function getExhibitNFTAddress(
        string memory _id
    ) public view returns (address) {
        return address(exhibits[_id]);
    }
}
