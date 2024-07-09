import { ethers } from "hardhat";

async function main() {

    // Get the signers
    const [controller, owner, beneficiary1, beneficiary2, funder] = await ethers.getSigners();

    // Hardcoded addresses
    const usdcTokenAddress = "0xDd4c60185608108D073C19432eef0ae50AB3830d";
    const museumAddress = "0xF4857Efc226Bb39C6851Aa137347CFf8F8e050F9";
    const organizerServiceAddress = "0xdFB611127315848Fd0D53226eC886BbF6514B5D1";
    const artifactNFT1 = "0x160f48cad57bf2a4f537df5fbb24277619f34ac5";
    const artifactNFT2 = "0x5851195868fdc91585cc2308595c2b8c992c06f2";

    // Connect to the contracts
    const OrganizerService = await ethers.getContractFactory("EventOrganizerService");
    const Museum = await ethers.getContractFactory("Museum");
    const UsdcToken = await ethers.getContractFactory("MUSDC");

    const organizerService = OrganizerService.attach(organizerServiceAddress).connect(owner);
    const museum = Museum.attach(museumAddress).connect(owner);
    const usdcToken = UsdcToken.attach(usdcTokenAddress).connect(owner);

    // Read the contract state
    const exhibitNFTAddress = await organizerService.exhibits("exhibit1");
    const exhibit2NFTAddress = await organizerService.exhibits("exhibit2");
    const exhibitMuseumAddress = await museum.exhibits("exhibit1");
    ////console.log("ExhibitNFT deployed to:", exhibitNFTAddress)
    ////console.log("ExhibitMuseum deployed to:", exhibitMuseumAddress)
    ////console.log("ExhibitNFT deployed to:", exhibit2NFTAddress)

    //check funder usdc balance
    const funderBalance = await usdcToken.balanceOf(funder.address);
    //if funder balance is zero send some usdc tokens from owner
    if (funderBalance == 0) {
        //load some usdc
        ////console.log("loading funder with usdc")
        const tx = await usdcToken.transfer(funder.address, ethers.parseUnits("2000000", 18));
        //distribute some USDC to the funders
        await tx.wait(1);
        
    }
    ////console.log("done")
    // // Purchase a few tickets
    const tx1 = await usdcToken.connect(funder).approve(museum.target, ethers.parseUnits("30", 18),); // Approve 3 USDC
    const receipt1 = await tx1.wait(2);
    ////console.log("approve tx", receipt1.status)
    const tx2 = await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    const receipt2 = await tx2.wait(2);
    ////console.log("purchase ticket 1", receipt2.status)
    const tx3 = await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    const receipt3 = await tx3.wait(2);
    ////console.log("purchase ticket 2", receipt3.status)
    const tx4 = await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    const receipt4 = await tx4.wait(2);
    ////console.log("purchase ticket 3", receipt4.status)


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });