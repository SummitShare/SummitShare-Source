

async function main() {
    // Get the signers
    const [owner] = await ethers.getSigners();

    // Hardcoded Exhibit Parameters
    const exhibit1 = {
        name: "The Greatest Test",
        symbol: "tt1",
        ticketPrice: "2",
        beneficiaries: ["0x6E95E4a97efb1FaDE341Cd867F07101C7b997151", "0x6E95E4a97efb1FaDE341Cd867F07101C7b997151"], // Replace with actual addresses
        shares: [50, 50],
        baseURI: "http://localhost:3000/api/ticket/",
        location: "Lusaka,Zambia",
        artifactNFT: "0x5851195868fdc91585cc2308595c2b8c992c06f2", // Replace with actual ArtifactNFT address
        details: "Testing Boundaries",
        id: "TGT0"
    };

    // Address of deployed EventOrganizerService
    const organizerServiceAddress = "0xdFB611127315848Fd0D53226eC886BbF6514B5D1";

    // Connect to the EventOrganizerService contract
    const OrganizerService = await ethers.getContractFactory("EventOrganizerService");
    const organizerService = OrganizerService.attach(organizerServiceAddress).connect(owner);

    // Organize an exhibit
    const tx = await organizerService.organizeExhibit(
        exhibit1.name,
        exhibit1.symbol,
        exhibit1.ticketPrice,
        exhibit1.beneficiaries,
        exhibit1.shares,
        exhibit1.baseURI,
        exhibit1.location,
        exhibit1.artifactNFT,
        exhibit1.details,
        exhibit1.id
    );

    // Wait for Transaction Receipt
    const receipt = await tx.wait(6);
    console.log("Organized Exhibit 1", receipt.status);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error deploying Exhibit', error);
        process.exit(1);
    });
