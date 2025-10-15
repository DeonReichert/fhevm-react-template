/**
 * Deployment Script for ConfidentialLandPlatform v2.0
 * Privacy-Preserving Urban Planning Platform
 */

const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🏗️  Deploying ConfidentialLandPlatform v2.0 to Sepolia...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying from address:", deployer.address);

  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Get deployment configuration from environment
  const numPausers = parseInt(process.env.NUM_PAUSERS || "0");
  const initialKmsGeneration = parseInt(process.env.INITIAL_KMS_GENERATION || "1");

  console.log("⚙️  Configuration:");
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   KMS Generation: ${initialKmsGeneration}`);
  console.log(`   Number of Pausers: ${numPausers}\n`);

  // Validate configuration
  if (numPausers === 0) {
    throw new Error("❌ NUM_PAUSERS must be set in .env file");
  }

  // Collect pauser addresses
  const pauserAddresses = [];
  for (let i = 0; i < numPausers; i++) {
    const pauserKey = `PAUSER_ADDRESS_${i}`;
    const pauserAddress = process.env[pauserKey];

    if (!pauserAddress || pauserAddress.length !== 42 || !pauserAddress.startsWith("0x")) {
      throw new Error(`❌ Invalid or missing ${pauserKey} in .env file`);
    }

    pauserAddresses.push(pauserAddress);
    console.log(`   Pauser ${i}: ${pauserAddress}`);
  }

  console.log("\n⏳ Deploying contract...");

  // Get contract factory
  const ConfidentialLandPlatform = await hre.ethers.getContractFactory("ConfidentialLandPlatform");

  // Deploy
  const contract = await ConfidentialLandPlatform.deploy(
    pauserAddresses,
    initialKmsGeneration
  );

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n✅ Deployment Successful!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📄 CONTRACT INFORMATION");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Chain ID: ${(await hre.ethers.provider.getNetwork()).chainId}`);
  console.log(`   Block Number: ${await hre.ethers.provider.getBlockNumber()}`);

  // Verify pauser configuration
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔐 PAUSER CONFIGURATION");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const pauserCount = await contract.getPauserCount();
  console.log(`   Total Pausers: ${pauserCount}`);

  for (let i = 0; i < pauserCount; i++) {
    const pauser = await contract.getPauserAtIndex(i);
    const isPauser = await contract.isPauser(pauser);
    console.log(`   ${i + 1}. ${pauser} ${isPauser ? '✓' : '✗'}`);
  }

  // Verify KMS configuration
  const kmsGen = await contract.kmsGeneration();
  console.log(`\n   KMS Generation: ${kmsGen}`);

  // Check contract state
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 CONTRACT STATE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const isPaused = await contract.isContractPaused();
  const authority = await contract.cityPlanningAuthority();
  const isDecryptAllowed = await contract.isPublicDecryptAllowed();

  console.log(`   Planning Authority: ${authority}`);
  console.log(`   Contract Paused: ${isPaused ? 'Yes ⏸️' : 'No ▶️'}`);
  console.log(`   Decryption Allowed: ${isDecryptAllowed ? 'Yes ✓' : 'No ✗'}`);
  console.log(`   Total Zones: ${await contract.getTotalZones()}`);
  console.log(`   Total Projects: ${await contract.getTotalProjects()}`);

  // Save to .env
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💾 SAVE TO .ENV FILE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`CONTRACT_ADDRESS=${contractAddress}\n`);

  // Etherscan verification
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 VERIFY ON ETHERSCAN");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "[${pauserAddresses.map(a => `\\"${a}\\"`).join(',')}]" ${initialKmsGeneration}\n`);

  // Sepolia Explorer
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌐 VIEW ON EXPLORER");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}\n`);

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ DEPLOYMENT FAILED");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error(error);
    process.exit(1);
  });
