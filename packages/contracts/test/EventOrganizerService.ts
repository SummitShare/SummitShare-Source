import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("EventOrganizerService Contract Tests", function () {
  // Function to deploy and set up the necessary contracts
  async function deployContracts() {
    // Deploying Museum contract

    const [owner, controller, beneficiary1, beneficiary2, funder] = await ethers.getSigners();

    // Deploy USDC token (or another ERC20 token)
    const MockUSDC = await ethers.getContractFactory("MUSDC");
    const usdcToken = await MockUSDC.connect(owner).deploy(ethers.parseUnits("200", 6));

    const Museum = await ethers.getContractFactory("Museum");
    const museum = await Museum.connect(owner).deploy(usdcToken.target);

    // Deploy EventOrganizerService with the deployed Museum and USDC token addresses
    const EventOrganizerService = await ethers.getContractFactory("EventOrganizerService");
    const organizerService = await EventOrganizerService.deploy(museum.target, usdcToken.target);

    // Deploy ArtifactNFT contract (or another ERC721 token)
    const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
    const artifactNFT = await ArtifactNFT.connect(owner).deploy("ArtifactNFT", "ANFT", owner, "https://api.example.com/nft/");

    return {
      museum,
      usdcToken,
      organizerService,
      owner,
      controller,
      beneficiary1,
      beneficiary2,
      funder,
      artifactNFT
    };
  }

  describe("Funding", function () {
    it("Should correctly organize an exhibit and emit an event", async function () {
      const { organizerService, beneficiary1, beneficiary2, artifactNFT } = await loadFixture(deployContracts);

      await expect(
        organizerService.organizeExhibit(
          
          "ExhibitName",
          "EXB",
          ethers.parseUnits("10", 18),
          [beneficiary1.address, beneficiary2.address],
          [50, 50],
          "https://api.example.com/nft/",
          "Lusaka,Zambia",
          artifactNFT.target,
          "Lusaka Art Gallery",
          "Exhibit1"
        )
      )
        .to.emit(organizerService, "ExhibitNFTDeployed")
        .withArgs("Exhibit1", anyValue, anyValue, anyValue); // using sinon for argument matching
    });
    it("Should revert if an exhibit with the same exhibitID that is already curated is organized again", async function () {
      const { organizerService, beneficiary1, beneficiary2, museum, owner , artifactNFT} = await loadFixture(deployContracts);


      await organizerService.organizeExhibit(
        
        "ExhibitName",
        "EXB",
        ethers.parseUnits("10", 18),
        [beneficiary1.address, beneficiary2.address],
        [50, 50],
        "https://api.example.com/nft/",
        "Lusaka,Zambia",
        artifactNFT.target,
        "Lusaka Art Gallery",
        "Exhibit1"
      )

      const exhibitNFT = await organizerService.connect(owner).exhibits("Exhibit1")
      await museum.connect(owner).curateExhibit("Exhibit1", exhibitNFT);
      await expect(organizerService.organizeExhibit(
        
        "ExhibitName",
        "EXB",
        ethers.parseUnits("10", 18),
        [beneficiary1.address, beneficiary2.address],
        [50, 50],
        "https://api.example.com/nft/",
        "Lusaka,Zambia",
        artifactNFT.target,
        "Lusaka Art Gallery",
        "Exhibit1"
      )).to.be.revertedWith("ExhibitID already taken.");
    });
    it("Should correctly read state variables of the deployed ExhibitNFT and EventEscrow contracts", async function () {
      const { organizerService, beneficiary1, beneficiary2, museum, owner , artifactNFT} = await loadFixture(deployContracts);
      const ticketPrice = ethers.parseUnits("10", 18);



      // Triggering the event by organizing an exhibit
      await organizerService.organizeExhibit(
        
        "ExhibitName",
        "EXB",
        ethers.parseUnits("10", 18),
        [beneficiary1.address, beneficiary2.address],
        [50, 50],
        "https://api.example.com/nft/",
        "Lusaka,Zambia",
        artifactNFT.target,
        "Lusaka Art Gallery",
        "Exhibit1"
      );
      const exhibitNFTAddress = await organizerService.connect(owner).exhibits("Exhibit1")
      const exhibitNFT = await ethers.getContractAt("ExhibitNFT", exhibitNFTAddress);
      const eventEscrow = await ethers.getContractAt("EventEscrow", await exhibitNFT.escrow());
      const address1 = await eventEscrow.beneficiaries(0);
      const address2 = await eventEscrow.beneficiaries(1);
      const share1 = await eventEscrow.payouts(address1)
      const share2 = await eventEscrow.payouts(address2)

      expect(share1).to.equal(50)

      expect(share2).to.equal(50)


    });
    it("Should correctly set any revenue split", async function () {
      const { organizerService, beneficiary1, beneficiary2, museum, owner , artifactNFT} = await loadFixture(deployContracts);
      const ticketPrice = ethers.parseUnits("10", 18);



      // Triggering the event by organizing an exhibit
      await organizerService.organizeExhibit(
       
        "ExhibitName",
        "EXB",
        ethers.parseUnits("10", 18),
        [beneficiary1.address, beneficiary2.address],
        [10, 9000],
        "https://api.example.com/nft/",
        "Lusaka,Zambia",
        artifactNFT.target,
        "Lusaka Art Gallery",
        "Exhibit1"
      );
      const exhibitNFTAddress = await organizerService.connect(owner).exhibits("Exhibit1")
      const exhibitNFT = await ethers.getContractAt("ExhibitNFT", exhibitNFTAddress);
      const eventEscrow = await ethers.getContractAt("EventEscrow", await exhibitNFT.escrow());
      const address1 = await eventEscrow.beneficiaries(0);
      const address2 = await eventEscrow.beneficiaries(1);
      const share1 = await eventEscrow.payouts(address1)
      const share2 = await eventEscrow.payouts(address2)

      expect(share1).to.equal(10)

      expect(share2).to.equal(9000)


    });


  });
});
