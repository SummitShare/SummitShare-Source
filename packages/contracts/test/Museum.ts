import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Museum Contract Tests", function() {
  async function deployContracts() {
    const [
      owner,
      controller,
      beneficiary1,
      beneficiary2,
      funder,
      buyer
    ] = await ethers.getSigners();

    // Deploy USDC token (or another ERC20 token)
    const MockUSDC = await ethers.getContractFactory("MUSDC");
    const usdcToken = await MockUSDC.connect(buyer).deploy(ethers.parseUnits("200", 6));

    const Museum = await ethers.getContractFactory("Museum");
    const museum = await Museum.connect(owner).deploy(usdcToken.target);

     // Deploy ArtifactNFT contract (or another ERC721 token)
     const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
     const artifactNFT = await ArtifactNFT.connect(owner).deploy("ArtifactNFT", "ANFT", owner, "https://api.example.com/nft/");
 
    // Deploy EventOrganizerService with the deployed Museum and USDC token addresses
    const EventOrganizerService = await ethers.getContractFactory("EventOrganizerService");
    const organizerService = await EventOrganizerService.deploy(museum.target, usdcToken.target);

    await organizerService.organizeExhibit(
     
      "ExhibitName",
      "EXB",
      ethers.parseUnits("50", 6),
      [beneficiary1.address, beneficiary2.address],
      [50, 50],
      "https://api.example.com/nft/",
      "Lusaka,Zambia",
      artifactNFT.target,
      "Lusaka Art Gallery",
      "Exhibit1"
    );

    await organizerService.organizeExhibit(
      
      "ExhibitName2", //name
      "EX2", //symbol
      ethers.parseUnits("50", 6), //price
      [beneficiary1.address, beneficiary2.address, funder.address], //beneficiaries
      [50, 50, 50], //shares,
      "https://api.example.com/nft/",
      "Lusaka,Zambia",
      artifactNFT.target,
      "Lusaka Art Gallery2",
      "Exhibit2"
    );

    const exhibit1NFTAddress = await organizerService.exhibits("Exhibit1");
    const exhibit2NFTAddress = await organizerService.exhibits("Exhibit2");
    await museum.connect(owner).curateExhibit("WestWing", exhibit1NFTAddress);

    return {
      museum,
      organizerService,
      beneficiary1,
      beneficiary2,
      exhibit1NFTAddress,
      exhibit2NFTAddress,
      owner,
      buyer,
      usdcToken
    };
  }

  it("should correctly deploy a mock erc20 token", async function() {
    
    const { museum, owner, exhibit1NFTAddress, exhibit2NFTAddress } = await loadFixture(
      deployContracts
    );

    const MockUSDC = await ethers.getContractFactory("MUSDC");
    const usdcToken = await MockUSDC.connect(owner).deploy(ethers.parseUnits("200", 6));
      expect(await usdcToken.symbol()).to.equal("USDCM");
      expect(await usdcToken.name()).to.equal("USDC Mock");
      expect(await usdcToken.decimals()).to.equal(18);
      expect(await usdcToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("200", 6));
  });

  it("should correctly curate an exhibit", async function() {
    
    const { museum, owner, exhibit1NFTAddress, exhibit2NFTAddress } = await loadFixture(
      deployContracts
    );

    

    await museum.connect(owner).curateExhibit("EastWing", exhibit2NFTAddress);
    expect(await museum.exhibits("EastWing")).to.equal(exhibit2NFTAddress);
  });

  it("should override an existing exihibit if owner", async function() {
    const { museum, owner, exhibit1NFTAddress, exhibit2NFTAddress } = await loadFixture(
      deployContracts
    );
    await museum.connect(owner).curateExhibit("WestWing", exhibit2NFTAddress);
    expect(await museum.exhibits("WestWing")).to.equal(exhibit2NFTAddress);
  });

  it("should NOT override an existing exihibit if not owner", async function() {
    const { museum, buyer, exhibit1NFTAddress, exhibit2NFTAddress } = await loadFixture(
      deployContracts
    );
    await expect(
      museum.connect(buyer).curateExhibit("WestWing", exhibit2NFTAddress)
    ).to.be.revertedWithCustomError(museum, "OwnableUnauthorizedAccount");
    expect(await museum.exhibits("WestWing")).to.equal(exhibit1NFTAddress);
  });

  it("should allow purchasing a ticket", async function() {
    const { museum, buyer, usdcToken } = await loadFixture(deployContracts);
    await usdcToken.connect(buyer).approve(museum.target, ethers.parseUnits("50", 6));
    await museum.connect(buyer).purchaseTicket("WestWing", ethers.parseUnits("50", 6));
    // Further assertions can be added here like balance checking in ExhibitNFT and emitted events
  });

  it("should verify ticket ownership", async function() {
    const { museum, buyer, usdcToken, exhibit1NFTAddress } = await loadFixture(deployContracts);

    ////console.log("exhibit: ", await museum.exhibits("WestWing"), exhibit1NFTAddress);
    await usdcToken.connect(buyer).approve(museum.target, ethers.parseUnits("50", 6));
    await museum.connect(buyer).purchaseTicket("WestWing", ethers.parseUnits("50", 6));
    // const hasTicket = ;
     expect( await museum.verifyTicketOwnership("WestWing", buyer.address)).to.be.true;
  });

  it("should correctly update the escrow balance after ticket purchase", async function() {
    const { museum, buyer, usdcToken, organizerService, exhibit1NFTAddress } = await loadFixture(
      deployContracts
    );

    // Getting the escrow address associated with the exhibit
    const exhibit = new ethers.Contract(
      exhibit1NFTAddress,
      ["function escrow() view returns(address)"],
      buyer
    );
    const escrowAddress = await exhibit.escrow();

    // Approving the Museum contract to spend buyer's USDC
    await usdcToken.connect(buyer).approve(museum.target, ethers.parseUnits("50", 6));

    // Buying a ticket
    await museum.connect(buyer).purchaseTicket("WestWing", ethers.parseUnits("50", 6));

    // Check that the escrow balance has been updated
    const escrowBalance = await usdcToken.balanceOf(escrowAddress);
    expect(escrowBalance).to.equal(ethers.parseUnits("50", 6));
  });

  it("should correctly update the escrow balance after funds are distributed", async function() {
    const { museum, buyer, usdcToken, organizerService, exhibit1NFTAddress, beneficiary1 } = await loadFixture(
      deployContracts
    );
    // Buying a ticket
    await usdcToken.connect(buyer).approve(museum.target, ethers.parseUnits("50", 6));
    await museum.connect(buyer).purchaseTicket("WestWing", ethers.parseUnits("50", 6));


    // Getting the escrow address associated with the exhibit
    // Getting the escrow address associated with the exhibit
    const exhibit = new ethers.Contract(
      exhibit1NFTAddress,
      ["function escrow() view returns(address)"],
      buyer
    );
    const escrowAddress = await exhibit.escrow();
    const eventEscrow = await ethers.getContractAt("EventEscrow", escrowAddress);

    const escrowBalanceBefore = await usdcToken.balanceOf(await exhibit.escrow());
    expect(escrowBalanceBefore).to.equal(ethers.parseUnits("50", 6));

    // Approving the Museum contract to spend buyer's USDC
    await eventEscrow.connect(beneficiary1).distributePayments();
    
    // Check that the escrow balance has been updated
    const escrowBalanceAfter = await usdcToken.balanceOf(await exhibit.escrow());
    expect(escrowBalanceAfter).to.equal(ethers.parseUnits("0", 6));
  });
});
