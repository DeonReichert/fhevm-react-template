import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { ConfidentialLandRegistry } from "../typechain-types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("ConfidentialLandRegistrySepolia", function () {
  let signers: Signers;
  let contract: ConfidentialLandRegistry;
  let contractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`  ${++step}/${steps} ${message}`);
  }

  before(async function () {
    // Only run on Sepolia testnet
    if (fhevm.isMock) {
      console.warn(`⚠️  This test suite can only run on Sepolia Testnet`);
      console.warn(`    Use: npm run test:sepolia`);
      this.skip();
    }

    console.log("\n📡 Connecting to Sepolia Testnet...\n");

    try {
      const deployment = await deployments.get("ConfidentialLandRegistry");
      contractAddress = deployment.address;
      contract = await ethers.getContractAt(
        "ConfidentialLandRegistry",
        deployment.address
      ) as ConfidentialLandRegistry;

      console.log(`✅ Contract found at: ${contractAddress}\n`);
    } catch (e) {
      const error = e as Error;
      error.message += "\n\n❌ Contract not deployed. Run:\n   npx hardhat deploy --network sepolia\n";
      throw error;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };

    console.log(`👤 Test account: ${signers.alice.address}\n`);
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("should register encrypted land zone on Sepolia", async function () {
    steps = 6;
    this.timeout(4 * 60000); // 4 minutes for testnet

    console.log("\n🧪 Starting Sepolia Test: Zone Registration\n");

    progress("Preparing test data...");
    const clearArea = 5000;
    const clearPopulation = 1200;
    const clearValue = 850;
    const zoningType = 1; // Residential
    const description = "Sepolia Test Residential Zone";

    progress("Encrypting sensitive land data with FHE...");
    const encrypted = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(clearArea)
      .add32(clearPopulation)
      .add32(clearValue)
      .encrypt();

    console.log(`   📦 Encrypted 3 values (area, population, value)`);

    progress(`Registering zone on contract ${contractAddress}...`);
    const tx = await contract
      .connect(signers.alice)
      .registerLandZone(
        encrypted.handles[0],
        encrypted.handles[1],
        encrypted.handles[2],
        zoningType,
        description,
        encrypted.inputProof
      );

    console.log(`   📝 Transaction hash: ${tx.hash}`);

    progress("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log(`   ⛽ Gas used: ${receipt?.gasUsed.toString()}`);
    expect(receipt?.status).to.equal(1);

    progress("Querying registered zone public info...");
    const totalZones = await contract.getTotalZones();
    const zoneId = totalZones - 1n;

    const zoneInfo = await contract.getZonePublicInfo(zoneId);
    console.log(`   🏘️  Zone ID: ${zoneId}`);
    console.log(`   👤 Owner: ${zoneInfo.owner}`);
    console.log(`   🏗️  Type: ${zoneInfo.zoningType}`);
    console.log(`   📄 Description: ${zoneInfo.description}`);
    console.log(`   ✅ Active: ${zoneInfo.isActive}`);

    progress("Verifying zone registration...");
    expect(zoneInfo.owner).to.equal(signers.alice.address);
    expect(zoneInfo.zoningType).to.equal(zoningType);
    expect(zoneInfo.description).to.equal(description);
    expect(zoneInfo.isActive).to.be.true;

    console.log("\n✅ Test completed successfully!\n");
  });

  it("should query total zones count on Sepolia", async function () {
    steps = 2;
    this.timeout(2 * 60000); // 2 minutes

    console.log("\n🧪 Starting Sepolia Test: Total Zones Query\n");

    progress("Querying total zones from contract...");
    const totalZones = await contract.getTotalZones();

    console.log(`   📊 Total zones registered: ${totalZones}`);

    progress("Verifying query result...");
    expect(totalZones).to.be.gte(0n);

    console.log("\n✅ Test completed successfully!\n");
  });

  it("should verify contract owner on Sepolia", async function () {
    steps = 2;
    this.timeout(2 * 60000); // 2 minutes

    console.log("\n🧪 Starting Sepolia Test: Owner Verification\n");

    progress("Querying contract owner...");
    const owner = await contract.owner();

    console.log(`   👑 Contract owner: ${owner}`);

    progress("Verifying owner address...");
    expect(owner).to.be.properAddress;
    expect(owner).to.not.equal(ethers.ZeroAddress);

    console.log("\n✅ Test completed successfully!\n");
  });

  it("should check pause status on Sepolia", async function () {
    steps = 2;
    this.timeout(2 * 60000); // 2 minutes

    console.log("\n🧪 Starting Sepolia Test: Pause Status\n");

    progress("Querying contract pause status...");
    const isPaused = await contract.paused();

    console.log(`   ⏸️  Contract paused: ${isPaused}`);

    progress("Verifying pause status...");
    expect(typeof isPaused).to.equal("boolean");

    console.log("\n✅ Test completed successfully!\n");
  });

  it("should query specific zone info if zones exist", async function () {
    steps = 3;
    this.timeout(3 * 60000); // 3 minutes

    console.log("\n🧪 Starting Sepolia Test: Zone Info Query\n");

    progress("Checking if any zones are registered...");
    const totalZones = await contract.getTotalZones();

    console.log(`   📊 Total zones: ${totalZones}`);

    if (totalZones === 0n) {
      progress("Skipping - no zones registered yet");
      console.log("\n⏭️  Test skipped (no zones to query)\n");
      this.skip();
      return;
    }

    progress("Querying first zone (Zone ID: 0)...");
    const zoneInfo = await contract.getZonePublicInfo(0n);

    console.log(`   👤 Owner: ${zoneInfo.owner}`);
    console.log(`   🏗️  Zoning Type: ${zoneInfo.zoningType}`);
    console.log(`   📄 Description: ${zoneInfo.description}`);
    console.log(`   ✅ Active: ${zoneInfo.isActive}`);

    progress("Verifying zone data...");
    expect(zoneInfo.owner).to.be.properAddress;
    expect(zoneInfo.owner).to.not.equal(ethers.ZeroAddress);
    expect(zoneInfo.zoningType).to.be.gte(0);

    console.log("\n✅ Test completed successfully!\n");
  });
});
