import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("StorageContract", function () {
  // let storageContract, revenueSharingContract, usdc;
  // let owner, controller, rs2, rs3, funder;

  async function deployFixture() {
    const [owner, controller, rs2, rs3, funder] = await ethers.getSigners();

    // Deploy a mocked USDC contract using OpenZeppelin's ERC20 preset
    const MockUSDC = await ethers.getContractFactory("MUSDC");
    const usdc = await MockUSDC.connect(controller).deploy(ethers.parseUnits("200", 6));

    // Deploy StorageContract
    const StorageContract = await ethers.getContractFactory("StorageContract");
    const storageContract = await StorageContract.connect(controller).deploy();
    await storageContract.initializeController(controller.address);

    // Deploy RevenueSharingContract
    const RevenueSharingContract = await ethers.getContractFactory("RevenueSharingContract");
    const revenueSharingContract = await RevenueSharingContract.connect(controller).deploy(
      rs2.address,
      rs3.address,
      50
    );
    await revenueSharingContract.initialize(
      storageContract.target,
      rs2.address,
      rs3.address,
      50,
      usdc.target
    );

    
    await storageContract.setContracts(revenueSharingContract.target, usdc.target);

    return { storageContract, revenueSharingContract, usdc, owner, controller, rs2, rs3, funder };

  }
  describe("Funding", function () {
    it("Should allow funding and emit ContractFunded", async function () {
      const { storageContract, revenueSharingContract, usdc, owner, controller, rs2, rs3, funder } =
        await loadFixture(deployFixture);
      // Approve USDC for funder
      await usdc.connect(controller).transfer(funder, ethers.parseUnits("50", 6));
      await usdc.connect(funder).approve(storageContract.target, ethers.parseUnits("50", 6));

      await expect(storageContract.connect(funder).fundContract(ethers.parseUnits("50", 6)))
        .to.emit(storageContract, "ContractFunded")
        .withArgs(funder.address, ethers.parseUnits("50", 6));
    });

    it("Should distribute funds when threshold is reached and controller sent", async function () {
      // Approve USDC for funder
      const { storageContract, revenueSharingContract, usdc, owner, controller, rs2, rs3, funder } =
        await loadFixture(deployFixture);

      await usdc.connect(controller).transfer(storageContract.target, ethers.parseUnits("50", 6));
      await usdc.connect(controller).approve(storageContract.target, ethers.parseUnits("50", 6));

      // await storageContract.connect(controller).fundContract(ethers.parseUnits("1", 6));
      await expect(storageContract.connect(controller).fundContract(ethers.parseUnits("50", 6)))
        .to.emit(storageContract, "FundsSentToRevenueSharing")
        .withArgs(ethers.parseUnits("100", 6));
    });
    
    it("Should  distribute funds when threshold is reached even if controller did not send", async function () {
      // Approve USDC for funder
      const { storageContract, revenueSharingContract, usdc, owner, controller, rs2, rs3, funder } =
        await loadFixture(deployFixture);

      await usdc.connect(controller).transfer(storageContract.target, ethers.parseUnits("50", 6));
      await usdc.connect(controller).transfer(funder, ethers.parseUnits("50", 6));
      await usdc.connect(funder).approve(storageContract.target, ethers.parseUnits("50", 6));

      // await storageContract.connect(controller).fundContract(ethers.parseUnits("1", 6));
      await expect(
        storageContract.connect(funder).fundContract(ethers.parseUnits("50", 6))
      ).to.emit(revenueSharingContract, "FundsDistributed")
    });
  });
});
