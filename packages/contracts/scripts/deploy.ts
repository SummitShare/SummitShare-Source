// Import ethers from Hardhat, not necessary to import it separately
const { ethers } = require("hardhat");

async function main() {
  // Retrieve signers
  const [controller, owner, beneficiary1, beneficiary2, funder] = await ethers.getSigners();

  const MockUSDC = await ethers.getContractFactory("MUSDC");
  const usdcToken = await MockUSDC.connect(owner).deploy(ethers.parseUnits("20000000", 18));
  await usdcToken.deploymentTransaction().wait(1);

  //distribute some USDC to the funders
  const tx1 = await usdcToken.connect(owner).transfer(funder.address, ethers.parseUnits("2000000", 18));
  await tx1.wait();

  // Deploying Museum contract
  const Museum = await ethers.getContractFactory("Museum");
  const museum = await Museum.connect(owner).deploy(usdcToken.target);
  await museum.deploymentTransaction().wait(1);

  // Deploy EventOrganizerService with the deployed Museum and USDC token addresses
  const EventOrganizerService = await ethers.getContractFactory("EventOrganizerService");
  const organizerService = await EventOrganizerService.deploy(museum.target, usdcToken.target);
  await organizerService.deploymentTransaction().wait(1);


  // Deploy ArtifactNFT
  const artifact1 = {
    name: "",
    symbol: "",
    owner: owner.address,
    baseURI: "",
  }
  const artifact2 = {
    name: "",
    symbol: "",
    owner: owner.address,
    baseURI: "",
  }


  const tx0 = await organizerService.connect(owner).deployArtifactNFT(
    artifact1.name,
    artifact1.symbol,
    artifact1.owner,
    artifact1.baseURI
  );
  const receipt0 = await tx0.wait(6);
  console.log("Deployed ArtifactNFT 1", receipt0.status)

    // Find the event that contains the deployed ArtifactNFT address
    const artifactNFT1Address = receipt0.logs.find(
      log => log.fragment && log.fragment.name === 'ArtifactNFTDeployed'
    ).args.artifactNFT;
    

  const tx00 = await organizerService.connect(owner).deployArtifactNFT(
    artifact2.name,
    artifact2.symbol,
    artifact2.owner,
    artifact2.baseURI
  );
  const receipt00 = await tx00.wait(6);
  console.log("Deployed ArtifactNFT 2", receipt00.status)

    // Find the event that contains the deployed ArtifactNFT address
    const artifactNFT2Address = receipt00.logs.find(
      log => log.fragment && log.fragment.name === 'ArtifactNFTDeployed'
    ).args.artifactNFT;

  // log addresses
  console.log("MUSDC deployed to:", usdcToken.target);
  console.log("Museum deployed to:", museum.target);
  console.log("EventOrganizerService deployed to:", organizerService.target);
  console.log("ArtifactNFT 1 deployed to:", artifactNFT1Address);
  console.log("ArtifactNFT 2 deployed to:", artifactNFT2Address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });