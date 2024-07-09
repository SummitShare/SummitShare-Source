import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("EventOrganizerService Contract Tests", function () {
    // Function to deploy and set up the necessary contracts
    async function deployContracts() {
        // Deploying Museum contract

        const [owner, controller, beneficiary1, beneficiary2, funder] = await ethers.getSigners();

        const MockUSDC = await ethers.getContractFactory("MUSDC");
        const usdcToken = await MockUSDC.connect(owner).deploy(ethers.parseUnits("20000000", 18));

        //distribute some USDC to the funders
        await usdcToken.connect(owner).transfer(funder.address, ethers.parseUnits("2000000", 18));

        const Museum = await ethers.getContractFactory("Museum");
        const museum = await Museum.connect(owner).deploy(usdcToken.target);

        // Deploy EventOrganizerService with the deployed Museum and USDC token addresses
        const EventOrganizerService = await ethers.getContractFactory("EventOrganizerService");
        const organizerService = await EventOrganizerService.deploy(museum.target, usdcToken.target);

        ////console.log("MUSDC deployed to:", usdcToken.target);
        ////console.log("Museum deployed to:", museum.target);
        ////console.log("EventOrganizerService deployed to:", organizerService.target);

        // Deploy ArtifactNFT
        const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
        const artifactNFT1 = await ArtifactNFT.connect(owner).deploy("LusakaCollection", "LAGC", owner.address, "http://localhost:3000/api/nft/");
        const artifactNFT2 = await ArtifactNFT.connect(owner).deploy("WomenCollection", "WHMC", owner.address, "http://localhost:3000/api/nft/");

        ////console.log("ArtifactNFT deployed to:", artifactNFT1.target);
        ////console.log("ArtifactNFT deployed to:", artifactNFT2.target);
        // Organize an exhibit
        await organizerService.connect(owner).organizeExhibit(

            "Lusaka Art Gallery",
            "LAG",
            ethers.parseUnits("10", 18), // ticket price
            [beneficiary1.address, beneficiary2.address], // beneficiaries
            [50, 50], // shares
            "http://localhost:3000/api/ticket/", // base URI
            "Lusaka,Zambia", // location
            artifactNFT1.target, // ArtifactNFT address
            "Expressing the word with color", // details
            "exhibit1" //exhibit id
        );
        ////console.log("Organized Exhibit 1")
        await organizerService.connect(owner).organizeExhibit(

            "Womens History Museum",
            "WHM",
            ethers.parseUnits("10", 18), // ticket price
            [beneficiary1.address, beneficiary2.address], // beneficiaries
            [50, 50], // shares
            "http://localhost:3000/api/ticket/", // base URI
            "New York,USA", // location
            artifactNFT2.target, // ArtifactNFT address
            "Those who walked before us and those to come.", // collection
            "exhibit2"
        );
        ////console.log("Organized Exhibit 2")

        // Retrieve the ExhibitNFT contract


        const exhibitNFTAddress = await organizerService.getExhibitNFTAddress("exhibit1");
        ////console.log("ExhibitNFT deployed to:", exhibitNFTAddress)
        const ExhibitNFT = await ethers.getContractFactory("ExhibitNFT");
        const exhibitNFT = ExhibitNFT.attach(exhibitNFTAddress);

        const escrowAddress = await exhibitNFT.escrow();
        const Escrow = await ethers.getContractFactory("EventEscrow");
        const escrow = Escrow.attach(escrowAddress);

        ////console.log("ExhibitNFT deployed to:", exhibitNFT.target);

        // Register the exhibit with the museum
        await museum.connect(owner).curateExhibit("exhibit1", exhibitNFT.target);

        // Purchase a few tickets
        await usdcToken.connect(funder).approve(museum.target, ethers.parseUnits("30", 18),); // Approve 3 USDC
        await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
        await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
        await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket

        return {
            museum,
            usdcToken,
            organizerService,
            owner,
            controller,
            beneficiary1,
            beneficiary2,
            funder,
            artifactNFT1,
            exhibitNFT,
            escrow
        };
    }

    describe("Deploy", function () {
        it("Should correctly organize an exhibit and emit an event", async function () {
            const { museum, owner, artifactNFT1, exhibitNFT } = await deployContracts();

            // Check that the ExhibitNFT was deployed
            expect(await museum.exhibits("exhibit1")).to.equal(exhibitNFT.target);

            // Check that the ExhibitNFT was deployed with the correct parameters
            expect(await artifactNFT1.name()).to.equal("LusakaCollection");
            expect(await artifactNFT1.symbol()).to.equal("LAGC");
            expect(await artifactNFT1.owner()).to.equal(owner.address);
        });
        it("should test the escrow balanbce increases after each purchase", async function () {
            const { museum, owner, artifactNFT1, exhibitNFT, usdcToken, escrow } = await deployContracts();

            // Check that the ExhibitNFT was deployed
            expect(await museum.exhibits("exhibit1")).to.equal(exhibitNFT.target);
            //check that the escrow balance is now 30
            expect(await usdcToken.balanceOf(escrow.target)).to.equal(ethers.parseUnits("30", 18));


        })
        it("should test the escrow balance decreases after each distribution", async function () {
            const { museum, owner, artifactNFT1, exhibitNFT, usdcToken, escrow, beneficiary1, beneficiary2 } = await deployContracts();

            // Check that the ExhibitNFT was deployed
            expect(await museum.exhibits("exhibit1")).to.equal(exhibitNFT.target);
            //check that the escrow balance is now 30
            expect(await usdcToken.balanceOf(escrow.target)).to.equal(ethers.parseUnits("30", 18));

            //distribute the funds
            await escrow.connect(beneficiary1).distributePayments();

            //check that the escrow balance is now 0
            expect(await usdcToken.balanceOf(escrow.target)).to.equal(ethers.parseUnits("0", 18));

        });


    });
});
