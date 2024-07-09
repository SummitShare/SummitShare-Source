// Import ethers from Hardhat, not necessary to import it separately
const { ethers } = require("hardhat");

async function main() {
  // Retrieve signers
  const [owner, controller, beneficiary1, beneficiary2, funder] = await ethers.getSigners();

  ////console.log("owner", owner.address);
  ////console.log("controller", controller.address);
  ////console.log("beneficiary1", beneficiary1.address);
  ////console.log("beneficiary2", beneficiary2.address);
  ////console.log("funder", funder.address);
  //get a gas price estimate from the rpc
  // Hardcoded addresses
  const usdcTokenAddress = "0xC8eBF290a9B67c51d8EC65434fc477471fB9DF4e";
  const museumAddress = "0x0Ea01C333f05078C0a67a78836ca0d7b3b021f45";
  const organizerServiceAddress = "0x1dc559C5F957a4C17B3848E3AaD57A6C19188e0C";
  const artifactNFT1 = "0x460D2Cc5c90e3be03AeBEbDF91291963A81E8F76";
  const artifactNFT2 = "0x58497EdAdb66bE798372BdC5bd0334abDe0A427d";
  const exhibit1 = {
    name: "Lusaka Art Gallery",
    symbol: "LAG",
    ticketPrice: ethers.parseUnits("10", 18),
    beneficiaries: [beneficiary1.address, beneficiary2.address],
    shares: [50, 50],
    baseURI: "http://localhost:3000/api/ticket/",
    location: "Lusaka,Zambia",
    artifactNFT: artifactNFT1,
    details: "Expressing the word with color",
    id: "exhibit1"
  }
  const exhibit2 = {
    name: "Women’s History Museum",
    symbol: "WHM",
    ticketPrice: ethers.parseUnits("10", 18),
    beneficiaries: [beneficiary1.address, beneficiary2.address],
    shares: [50, 50],
    baseURI: "http://localhost:3000/api/ticket/",
    location: "New York,USA",
    artifactNFT: artifactNFT2,
    details: "Those who walked before us and those to come.",
    id: "exhibit2"
  }

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
  // get usdcToken set on museum
  const exhibitMuseumAddress = await museum.exhibits("exhibit1");
  ////console.log("ExhibitNFT deployed to:", exhibitNFTAddress)
  ////console.log("ExhibitMuseum deployed to:", exhibitMuseumAddress)
  ////console.log("ExhibitNFT deployed to:", exhibit2NFTAddress)


  // const ownerAddress = "<ownerAddress>";
  // const funderAddress = "<funderAddress>";

  // const UsdcToken = await ethers.getContractFactory("MUSDC");
  // const usdcTokenContract = UsdcToken.attach(usdcTokenAddress).connect(owner);
  // // Testing something that should work...
  // //check funder usdc balance
  // const funderBalance = await usdcTokenContract.balanceOf(funder.address);
  // ////console.log("funder balance", funderBalance.toString())
  // //if funder balance is zero send some usdc tokens from owner
  // if (funderBalance == 0) {
  //   //load some usdc
  //   ////console.log("loading funder with usdc")
  //   const tx = await usdcTokenContract.transfer(funder.address, ethers.parseUnits("2000000", 18));
  //   //distribute some USDC to the funders
  //   await tx.wait();
  //   ////console.log("done")
  // }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });