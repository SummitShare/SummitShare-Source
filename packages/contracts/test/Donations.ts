import { ethers } from "hardhat";
import { expect } from "chai";

/**
 * @title Tests for the Donations smart contract
 * @notice This test suite validates functionality and access control for the Donations contract.
 */

describe("Donations Contract Tests", function () {

/**
* Deploys mock tokens and the Donations contract, setting up initial states and balances.
* @returns A promise that resolves to an object containing instances of contracts and signers used in the tests.
*/

async function deployContracts() {
  // Obtain signers;
   const [owner, donor, projectWallet, communityWallet] = await ethers.getSigners();

     // Log signer addresses
     console.log("Owner address:", owner.address);
     console.log("Donor address:", donor.address);
     console.log("Project Wallet address:", projectWallet.address);
     console.log("Community Wallet address:", communityWallet.address);

       // Deploy a mock USDC token and set initial balances - any ERC20 token would work
        const MockUSD = await ethers.getContractFactory("MUSDC");
        const usdcToken = await MockUSD.connect(owner).deploy(ethers.parseUnits("1000", 18));

        // Transfer some USDC to the donor to enable them to make donations.
        await usdcToken.transfer(donor.address, ethers.parseUnits("200", 18));  // Ensure donor has enough tokens

        // Validate the token deployment by checking its properties.
        expect(await usdcToken.symbol()).to.equal("USDCM");
        expect(await usdcToken.name()).to.equal("USDC Mock");
        expect(await usdcToken.decimals()).to.equal(18);
        expect(await usdcToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("800", 18));

        // Deploy the Donations contract
        const Donations = await ethers.getContractFactory("Donations");
        const donations = await Donations.connect(owner).deploy(projectWallet.address, communityWallet.address);
    
        console.log("MUSDC Token deployed at:", usdcToken.target);
        console.log("Donations contract deployed at:", donations.target);

    // Approve the Donations contract to spend the donor's tokens
    await usdcToken.connect(donor).approve(donations.target, ethers.parseUnits("50", 18));
    return { usdcToken, donations, donor, projectWallet, communityWallet, owner };
}

describe("Donation functionality", function () {
  it("should allow a user to donate and emit a DonationReceived event", async function () {
      const { usdcToken, donations, donor } = await deployContracts();

      const initialBalance = await usdcToken.balanceOf(donor.address);
      expect(initialBalance).to.equal(ethers.parseUnits("200", 18))
      
      // Perform donation and check for event emission.
      await expect(donations.connect(donor).donate(ethers.parseUnits("10", 18), usdcToken.target, true, "Gavin Belson", false))
          .to.emit(donations, "DonationReceived")
          .withArgs(donor.address, ethers.parseUnits("10", 18), usdcToken.target, "Project", "Gavin Belson", false);

          // Check balance after donation
          const finalBalance = await usdcToken.balanceOf(donor.address);
          expect(finalBalance).to.equal(ethers.parseUnits("190",18))
  });
});

describe("Owner-only functionalities", function () {
  it("should allow the owner to update wallet addresses", async function () {
      const { donations, owner, donor } = await deployContracts();
      await expect(donations.connect(owner).updateWalletAddresses(donor.address, donor.address))
          .to.emit(donations, "WalletAddressesUpdated")
          .withArgs(donor.address, donor.address);
      const [projectWallet, communityWallet] = await donations.getWalletAddresses();
      expect(projectWallet).to.equal(donor.address);
      expect(communityWallet).to.equal(donor.address);
  });

  it("should revert if a non-owner tries to update wallet addresses", async function () {
    const { donations, donor } = await deployContracts();
    await expect(donations.connect(donor).updateWalletAddresses(donor.address, donor.address))
    .to.be.reverted;
  });

describe("Contract initial state validation", function () {
  it("should have correct initial wallet addresses", async function () {
      const { donations, projectWallet, communityWallet } = await deployContracts();
      const [initialProjectWallet, initialCommunityWallet] = await donations.getWalletAddresses();
      expect(initialProjectWallet).to.equal(projectWallet.address);
      expect(initialCommunityWallet).to.equal(communityWallet.address);
  });
});
})});
