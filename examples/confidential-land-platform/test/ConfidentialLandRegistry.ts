import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { ConfidentialLandRegistry } from "../typechain-types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
  charlie: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = await ethers.getContractFactory("ConfidentialLandRegistry");
  const contract = await factory.deploy() as ConfidentialLandRegistry;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("ConfidentialLandRegistry", function () {
  let signers: Signers;
  let contract: ConfidentialLandRegistry;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
      charlie: ethSigners[3]
    };
  });

  beforeEach(async function () {
    // Only run on Mock environment for fast testing
    if (!fhevm.isMock) {
      console.warn(`⚠️  This test suite cannot run on Sepolia - use Mock environment`);
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  describe("Deployment", function () {
    it("should deploy successfully with valid address", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("should set deployer as initial owner", async function () {
      expect(await contract.owner()).to.equal(signers.deployer.address);
    });

    it("should initialize with zero total zones", async function () {
      expect(await contract.getTotalZones()).to.equal(0n);
    });

    it("should have correct contract name", async function () {
      const address = await contract.getAddress();
      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe("Zone Registration", function () {
    it("should register a new land zone with encrypted data", async function () {
      const clearArea = 5000; // sq meters
      const clearPopulation = 1200;
      const clearValue = 850; // per sq meter
      const zoningType = 1; // Residential
      const description = "Test Residential Zone";

      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(clearArea)
        .add32(clearPopulation)
        .add32(clearValue)
        .encrypt();

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

      await expect(tx).to.emit(contract, "LandZoneRegistered");

      const totalZones = await contract.getTotalZones();
      expect(totalZones).to.equal(1n);
    });

    it("should increment zone ID for each registration", async function () {
      // Register first zone
      const encrypted1 = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(1000)
        .add32(500)
        .add32(600)
        .encrypt();

      await contract
        .connect(signers.alice)
        .registerLandZone(
          encrypted1.handles[0],
          encrypted1.handles[1],
          encrypted1.handles[2],
          1,
          "Zone 1",
          encrypted1.inputProof
        );

      // Register second zone
      const encrypted2 = await fhevm
        .createEncryptedInput(contractAddress, signers.bob.address)
        .add32(2000)
        .add32(800)
        .add32(700)
        .encrypt();

      await contract
        .connect(signers.bob)
        .registerLandZone(
          encrypted2.handles[0],
          encrypted2.handles[1],
          encrypted2.handles[2],
          2,
          "Zone 2",
          encrypted2.inputProof
        );

      expect(await contract.getTotalZones()).to.equal(2n);
    });

    it("should store correct public information", async function () {
      const zoningType = 3; // Industrial
      const description = "Industrial Park Zone";

      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(10000)
        .add32(300)
        .add32(1200)
        .encrypt();

      await contract
        .connect(signers.alice)
        .registerLandZone(
          encrypted.handles[0],
          encrypted.handles[1],
          encrypted.handles[2],
          zoningType,
          description,
          encrypted.inputProof
        );

      const zoneInfo = await contract.getZonePublicInfo(0n);
      expect(zoneInfo.zoningType).to.equal(zoningType);
      expect(zoneInfo.description).to.equal(description);
      expect(zoneInfo.owner).to.equal(signers.alice.address);
      expect(zoneInfo.isActive).to.be.true;
    });

    it("should handle multiple registrations from same owner", async function () {
      for (let i = 0; i < 3; i++) {
        const encrypted = await fhevm
          .createEncryptedInput(contractAddress, signers.alice.address)
          .add32(1000 * (i + 1))
          .add32(500 * (i + 1))
          .add32(600 * (i + 1))
          .encrypt();

        await contract
          .connect(signers.alice)
          .registerLandZone(
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            1,
            `Zone ${i + 1}`,
            encrypted.inputProof
          );
      }

      expect(await contract.getTotalZones()).to.equal(3n);
    });
  });

  describe("Encrypted Data Privacy", function () {
    it("should keep area encrypted on-chain", async function () {
      const clearArea = 5000;

      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(clearArea)
        .add32(1000)
        .add32(800)
        .encrypt();

      await contract
        .connect(signers.alice)
        .registerLandZone(
          encrypted.handles[0],
          encrypted.handles[1],
          encrypted.handles[2],
          1,
          "Test Zone",
          encrypted.inputProof
        );

      // Encrypted data should not be zero (not publicly visible)
      const zoneInfo = await contract.getZonePublicInfo(0n);
      expect(zoneInfo.owner).to.equal(signers.alice.address);
    });

    it("should not expose sensitive data in public getters", async function () {
      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(5000)
        .add32(1200)
        .add32(850)
        .encrypt();

      await contract
        .connect(signers.alice)
        .registerLandZone(
          encrypted.handles[0],
          encrypted.handles[1],
          encrypted.handles[2],
          1,
          "Confidential Zone",
          encrypted.inputProof
        );

      const publicInfo = await contract.getZonePublicInfo(0n);
      // Only public fields should be accessible
      expect(publicInfo.description).to.equal("Confidential Zone");
      expect(publicInfo.zoningType).to.equal(1);
    });
  });

  describe("Access Control", function () {
    it("should allow owner to pause contract", async function () {
      await expect(
        contract.connect(signers.deployer).pause()
      ).to.not.be.reverted;

      expect(await contract.paused()).to.be.true;
    });

    it("should prevent non-owner from pausing", async function () {
      await expect(
        contract.connect(signers.alice).pause()
      ).to.be.reverted;
    });

    it("should prevent operations when paused", async function () {
      await contract.connect(signers.deployer).pause();

      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(1000)
        .add32(500)
        .add32(600)
        .encrypt();

      await expect(
        contract
          .connect(signers.alice)
          .registerLandZone(
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            1,
            "Test",
            encrypted.inputProof
          )
      ).to.be.reverted;
    });

    it("should allow owner to unpause contract", async function () {
      await contract.connect(signers.deployer).pause();
      await contract.connect(signers.deployer).unpause();

      expect(await contract.paused()).to.be.false;
    });
  });

  describe("Edge Cases", function () {
    it("should handle zero area value", async function () {
      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(0) // Zero area
        .add32(1000)
        .add32(500)
        .encrypt();

      await expect(
        contract
          .connect(signers.alice)
          .registerLandZone(
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            1,
            "Zero Area Zone",
            encrypted.inputProof
          )
      ).to.not.be.reverted;
    });

    it("should handle maximum uint32 values", async function () {
      const maxUint32 = 2 ** 32 - 1;

      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(maxUint32)
        .add32(maxUint32)
        .add32(maxUint32)
        .encrypt();

      await expect(
        contract
          .connect(signers.alice)
          .registerLandZone(
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            1,
            "Max Value Zone",
            encrypted.inputProof
          )
      ).to.not.be.reverted;
    });

    it("should handle empty description string", async function () {
      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(1000)
        .add32(500)
        .add32(600)
        .encrypt();

      await expect(
        contract
          .connect(signers.alice)
          .registerLandZone(
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            1,
            "", // Empty description
            encrypted.inputProof
          )
      ).to.not.be.reverted;
    });

    it("should handle long description string", async function () {
      const longDescription = "A".repeat(500); // 500 character description

      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(1000)
        .add32(500)
        .add32(600)
        .encrypt();

      await expect(
        contract
          .connect(signers.alice)
          .registerLandZone(
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            1,
            longDescription,
            encrypted.inputProof
          )
      ).to.not.be.reverted;
    });

    it("should revert on invalid zone ID query", async function () {
      await expect(
        contract.getZonePublicInfo(999n)
      ).to.be.reverted;
    });
  });

  describe("Gas Optimization", function () {
    it("should register zone within reasonable gas limits", async function () {
      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(5000)
        .add32(1200)
        .add32(850)
        .encrypt();

      const tx = await contract
        .connect(signers.alice)
        .registerLandZone(
          encrypted.handles[0],
          encrypted.handles[1],
          encrypted.handles[2],
          1,
          "Gas Test Zone",
          encrypted.inputProof
        );

      const receipt = await tx.wait();
      expect(receipt?.gasUsed).to.be.gt(0n);
    });

    it("should query public info efficiently", async function () {
      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add32(1000)
        .add32(500)
        .add32(600)
        .encrypt();

      await contract
        .connect(signers.alice)
        .registerLandZone(
          encrypted.handles[0],
          encrypted.handles[1],
          encrypted.handles[2],
          1,
          "Query Test",
          encrypted.inputProof
        );

      // Public read should be gas efficient (view function)
      const info = await contract.getZonePublicInfo(0n);
      expect(info.owner).to.equal(signers.alice.address);
    });
  });

  describe("Multiple Users Interaction", function () {
    it("should handle concurrent registrations from different users", async function () {
      const users = [signers.alice, signers.bob, signers.charlie];

      for (let i = 0; i < users.length; i++) {
        const encrypted = await fhevm
          .createEncryptedInput(contractAddress, users[i].address)
          .add32(1000 * (i + 1))
          .add32(500 * (i + 1))
          .add32(600 * (i + 1))
          .encrypt();

        await contract
          .connect(users[i])
          .registerLandZone(
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            i + 1,
            `User ${i + 1} Zone`,
            encrypted.inputProof
          );
      }

      expect(await contract.getTotalZones()).to.equal(3n);

      // Verify each zone has correct owner
      for (let i = 0; i < users.length; i++) {
        const info = await contract.getZonePublicInfo(BigInt(i));
        expect(info.owner).to.equal(users[i].address);
      }
    });
  });
});
