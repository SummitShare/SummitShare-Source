import { ethers } from "hardhat";

async function main() {

    // Get the signers
    const [controller, owner, beneficiary1, beneficiary2, funder] = await ethers.getSigners();
    // Hardcoded addresses
    const usdcTokenAddress = "0xCF8cCFDb3Ff1E711ad0291360C8C84E3fADd5351";
    const museumAddress = "0x45eB3C8d2aedE8cDbfC7c71d36d2510183D0Cf09";
    const organizerServiceAddress = "0x24AFbcd71Ea88275f0d302706796ADE47DD0e923";
    const artifactNFT1 = "0xdb35aa7DD790623FFfc628fC51ea6AC6C089DAAE";

  
    const exhibit1 ={
        name: "The Leading Ladies of Zambia II",
        symbol: "LLEZ",
        ticketPrice: ethers.parseUnits("5", 18),
        beneficiaries: [beneficiary1.address, beneficiary2.address],
        shares: [50, 50],
        baseURI: "https://s3.tebi.io/tickets/",
        location: "Virtual Space",
        artifactNFT: artifactNFT1,
        details: "Join us as we reclaim and create new history.",
        id: "LLE1"
    }

    // Connect to the contracts
    const OrganizerService = await ethers.getContractFactory("EventOrganizerService");
    const Museum = await ethers.getContractFactory("Museum");
    const UsdcToken = await ethers.getContractFactory("MUSDC");
    const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
    
    const organizerService = OrganizerService.attach(organizerServiceAddress).connect(owner);
    const museum = Museum.attach(museumAddress).connect(owner);
    const usdcToken = UsdcToken.attach(usdcTokenAddress).connect(owner);
    const artifactNFT = ArtifactNFT.attach(artifactNFT1).connect(owner);
    
    // Organize an exhibit
    const tx1 = await organizerService.connect(owner).organizeExhibit( 
            exhibit1.name,
            exhibit1.symbol,
            exhibit1.ticketPrice, // ticket price
            exhibit1.beneficiaries, // beneficiaries
            exhibit1.shares, // shares
            exhibit1.baseURI, // base URI
            exhibit1.location, // location
            exhibit1.artifactNFT, // ArtifactNFT address
            exhibit1.details, // details
            exhibit1.id //exhibit id
        );
    const receipt1 = await tx1.wait(6);
    console.log("Organized Exhibit 1", receipt1.status)

 
    // Read the contract state
    const exhibitNFTAddress = await organizerService.exhibits("LLE1");
    console.log("ExhibitNFT 1 deployed to:", exhibitNFTAddress)

    const tx3 =  await museum.curateExhibit("LLE1", exhibitNFTAddress);
    const receipt3 = await tx3.wait(6);
    console.log("Curated Exhibit 1", receipt3.status)

    // get usdcToken set on museum exhibits
    const exhibitMuseumAddress = await museum.exhibits("LLE1");

    console.log("ExhibitNFT 1 deployed to:", exhibitNFTAddress)
    console.log("Exhibit1 Museum deployed to:", exhibitMuseumAddress)

    //mint artifactNFTs - exhibit 1
    const tx4 = await artifactNFT.mint(owner.address, 5);
    const receipt4 = await tx4.wait(6);
    console.log("Minted ArtifactNFT 1", receipt4.status)
    
  
  // // Purchase a few tickets
  // await usdcToken.connect(funder).approve(museum.target, ethers.parseUnits("30", 18),); // Approve 3 USDC
  // await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
  // await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
  // await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    
    
    
    
    // try {

    //     let tx2 = await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("20", 18)); // Purchase 1 ticket
    //     console.log("purchase ticket 1", tx2)
    // } catch (e) {
    //     console.log(e)
    // }
    // let tx3= await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    // await tx3.wait();
    // let tx4 = await museum.connect(funder).purchaseTicket("exhibit1", ethers.parseUnits("10", 18)); // Purchase 1 ticket
    // await tx4.wait();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });