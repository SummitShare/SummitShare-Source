// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Donations
 * @dev This contract allows users to donate ERC20 tokens to either a project or a heritage community wallet.
 * Ownable from OpenZeppelin is used to restrict certain functions to the contract owner.
 */

contract Donations is Ownable(msg.sender){
    using SafeERC20 for IERC20;

    address public projectWallet;
    address public communityWallet;

   /**
     * @dev Emitted when a donation is received.
     * @param donor Address of the donor.
     * @param amount Amount of tokens donated.
     * @param tokenAddress ERC20 token address of the donated tokens.
     * @param recipientType "Project" or "Community" indicating the target of the donation.
     * @param donorName Name of the donor; could be an alias if not anonymous.
     * @param isAnonymous Boolean indicating whether the donor chose to remain anonymous.
     */

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        address indexed tokenAddress,
        string recipientType,
        string donorName,
        bool isAnonymous
    );

    /**
     * @dev Emitted when the addresses for the project or community wallets are updated.
     * @param newProjectWallet New address for the project wallet.
     * @param newCommunityWallet New address for the community wallet.
     */

    event WalletAddressesUpdated(
        address indexed newProjectWallet,
        address indexed newCommunityWallet
    );

    /**
     * @dev Constructor to initialize the donation contract with specific wallets.
     * @param _projectWallet Address of the project wallet.
     * @param _communityWallet Address of the community wallet.
     */

    constructor(address _projectWallet, address _communityWallet) {
        require(_projectWallet != address(0), "project wallet address cannot be zero");
        require(_communityWallet != address(0), "community wallet address cannot be zero");
        projectWallet = _projectWallet;
        communityWallet = _communityWallet;
    }

    /**
     * @dev Allows a user to donate a specified amount of ERC20 tokens to a selected wallet.
     * @param amount Amount of tokens to donate.
     * @param tokenAddress Address of the ERC20 token to donate.
     * @param toProject Boolean to choose between project wallet (true) and community wallet (false).
     * @param donorName Name or alias of the donor. Can be empty if anonymous.
     * @param isAnonymous Boolean to indicate if the donor wishes to remain anonymous.
     */

    function donate(uint256 amount, address tokenAddress, bool toProject, string calldata donorName, bool isAnonymous) external {
        require(amount > 0, "Donation amount must be greater than zero");
        require(tokenAddress != address(0), "Token address cannot be zero");
        address recipient = toProject ? projectWallet : communityWallet;
        IERC20(tokenAddress).safeTransferFrom(msg.sender, recipient, amount);

        emit DonationReceived(msg.sender, amount, tokenAddress, toProject ? "Project" : "Community", donorName, isAnonymous);
    }
    // Updates the addresses for the project and community wallets. Can only be called by the contract owner.
    function updateWalletAddresses(address newProjectWallet, address newCommunityWallet) public onlyOwner {
        require(newProjectWallet != address(0), "New project wallet address cannot be zero");
        require(newCommunityWallet != address(0), "New community wallet address cannot be zero");
        projectWallet = newProjectWallet;
        communityWallet = newCommunityWallet;
        emit WalletAddressesUpdated(newProjectWallet, newCommunityWallet);
    }
    // Returns the current addresses of the project and community wallets.
    function getWalletAddresses() public view returns (address, address) {
        return (projectWallet, communityWallet);
    }
}
