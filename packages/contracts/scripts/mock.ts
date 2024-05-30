import { ethers } from "hardhat";

async function main() {

    // Get the signers
    const [controller, owner, beneficiary1, beneficiary2, funder] = await ethers.getSigners();

    // Hardcoded addresses
    const usdcTokenAddress = "0x9C337031e628cE48f24113db2b3437b83fB668a5";
    const museumAddress = "0x47CA7e46cEDCD8cB2ddAd9646c4F7954e9bE49D1";
    const organizerServiceAddress = "0x07591Dec37a5E1299fBC302B285712aA550b0Dd4";
    const artifactNFT1 = "0xD8b5a20Bf39fcDFF63C0850e5CfEdA0058780fFC";
    const artifactNFT2 = "0xF91634898bfcFC1C7Ac654C176d0604aC4ab3B4A";

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
    console.log("ExhibitNFT deployed to:", exhibitNFTAddress)
    console.log("ExhibitMuseum deployed to:", exhibitMuseumAddress)
    console.log("ExhibitNFT deployed to:", exhibit2NFTAddress)

    //check funder usdc balance
    const funderBalance = await usdcToken.balanceOf(funder.address);
    //if funder balance is zero send some usdc tokens from owner
    if (funderBalance == 0) {
        //load some usdc
        console.log("loading funder with usdc")
        const tx = await usdcToken.transfer(funder.address, ethers.parseUnits("2000000", 18));
        //distribute some USDC to the funders
        await tx.wait(1);
        
    }
    console.log("done")
    // // Purchase a few tickets
    const tx1 = await usdcToken.connect(funder).approve(museum.target, ethers.parseUnits("30", 18),); // Approve 3 USDC
    const receipt1 = await tx1.wait(2);
    console.log("approve tx", receipt1.status)
    const tx2 = await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    const receipt2 = await tx2.wait(2);
    console.log("purchase ticket 1", receipt2.status)
    const tx3 = await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    const receipt3 = await tx3.wait(2);
    console.log("purchase ticket 2", receipt3.status)
    const tx4 = await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    const receipt4 = await tx4.wait(2);
    console.log("purchase ticket 3", receipt4.status)


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });