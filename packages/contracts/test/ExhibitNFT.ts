import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe('ExhibitNFT', function () {

  async function deployContracts() {
    // Deploying Museum contract

    const [owner, controller, beneficiary1, beneficiary2, funder] = await ethers.getSigners();

    // Deploy USDC token (or another ERC20 token)
    const MockUSDC = await ethers.getContractFactory("MUSDC");
    const usdcToken = await MockUSDC.connect(owner).deploy(ethers.parseUnits("200", 6));
    const EventEscrow = await ethers.getContractFactory("EventEscrow");
    const eventEscrow = await EventEscrow.connect(owner).deploy(usdcToken.target, [beneficiary1, beneficiary2], [50,50]);

    // Deploy ArtifactNFT contract (or another ERC721 token)
    const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
    const artifactNFT = await ArtifactNFT.connect(owner).deploy("ArtifactNFT", "ANFT", owner, "https://api.example.com/nft/");

    // Deploy EventOrganizerService with the deployed Museum and USDC token addresses
    const ExhibitNFT = await ethers.getContractFactory("ExhibitNFT");
    const exhibitNFT = await ExhibitNFT.connect(owner).deploy(
      "EVENTNAME", // name
      "ENFT", // symbol
      100, // ticketPrice
      eventEscrow.target, // escrow
      owner.address, // owner
      'https://api.example.com/nft/', // baseURI
      "Lusaka,Zambia", // location
      artifactNFT.target, // ArtifactNFTAddress
      "Lusaka Art Gallery" // collection
    );
    return {
      exhibitNFT,
      eventEscrow,
      usdcToken,
      owner,
      controller,
      beneficiary1,
      beneficiary2,
      funder
    };
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { exhibitNFT, owner } = await  loadFixture(deployContracts);
      expect(await exhibitNFT.owner()).to.equal(owner.address);
    });

    it('Should set the right ticket price', async function () {
      const { exhibitNFT } = await  loadFixture(deployContracts);
      expect(await exhibitNFT.ticketPrice()).to.equal(100);
    });

    it('Should set the right escrow', async function () {
      const { exhibitNFT, eventEscrow } = await  loadFixture(deployContracts);
      expect(await exhibitNFT.escrow()).to.equal(eventEscrow.target);
    });
  });

  describe('Minting', function () {
    it('Should mint a ticket to an address', async function () {
      const { exhibitNFT, owner , funder} = await  loadFixture(deployContracts);
      await exhibitNFT.connect(owner).mintTicket(funder);
      expect(await exhibitNFT.ownerOf(0)).to.equal(funder.address);
    });

    it('Should emit a TicketMinted event on mint', async function () {
      const { exhibitNFT, owner , funder} = await  loadFixture(deployContracts);
      await expect(exhibitNFT.connect(owner).mintTicket(funder.address))
        .to.emit(exhibitNFT, 'TicketMinted')
        .withArgs(exhibitNFT.target, funder.address, 0);
    });

    it('Should fail if not owner tries to mint', async function () {
      const { exhibitNFT, funder } = await  loadFixture(deployContracts);
      await expect(
        exhibitNFT.connect(funder).mintTicket(funder.address)
      ).to.be.revertedWithCustomError(exhibitNFT, "OwnableUnauthorizedAccount");
    });

    it('Should set the correct tokenURI', async function () {
      const { exhibitNFT, owner , funder} = await  loadFixture(deployContracts);
      await expect(exhibitNFT.connect(owner).mintTicket(funder.address))
        .to.emit(exhibitNFT, 'TicketMinted')
        .withArgs(exhibitNFT.target, funder.address, 0);
      expect(await exhibitNFT.tokenURI(0)).to.equal('https://api.example.com/nft/0');
    });
  });
});