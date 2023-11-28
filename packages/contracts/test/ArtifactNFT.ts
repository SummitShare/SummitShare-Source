const { expect } = require("chai");
const { ethers } = require("hardhat");
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

async function deployArtifactNFT() {
    const [owner] = await ethers.getSigners();

    const ArtifactNFTFactory = await ethers.getContractFactory("ArtifactNFT");
    const artifactNFT = await ArtifactNFTFactory.deploy(
        "ArtifactNFT", // name
        "ANFT", // symbol
        owner.address, // owner
        "https://api.example.com/nft/" // baseURI
    );

    return { artifactNFT, owner };
}

describe("ArtifactNFT", function () {
    it("Should set the correct name and symbol", async function () {
        const { artifactNFT } = await loadFixture(deployArtifactNFT);

        expect(await artifactNFT.name()).to.equal("ArtifactNFT");
        expect(await artifactNFT.symbol()).to.equal("ANFT");
    });

    it("Should set the correct baseURI", async function () {
        const { artifactNFT, owner } = await loadFixture(deployArtifactNFT);
        //mint a token
        await artifactNFT.connect(owner).mint(owner.address, 5);
        //check the tokenURI
        expect(await artifactNFT.tokenURI(0)).to.equal("https://api.example.com/nft/0");
    });

    it("Should mint a new token", async function () {
        const { artifactNFT, owner } = await loadFixture(deployArtifactNFT);

        await artifactNFT.connect(owner).mint(owner.address, 5);
        expect(await artifactNFT.balanceOf(owner.address)).to.equal(5);
    });
});