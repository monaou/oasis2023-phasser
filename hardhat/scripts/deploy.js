const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const StageContract = await hre.ethers.getContractFactory("StageContract");
  const nftInstance = await StageContract.deploy();
  await nftInstance.deployed();

  const RewardPool = await hre.ethers.getContractFactory("RewardPool");
  const adminAddress = process.env.OWNER_ADDRESS;
  const usdcAddress = "0x346396166D64feeFB2FE5C2442427b546F431b91";  // <-- OAS sandverse

  const rewardPoolInstance = await RewardPool.deploy(nftInstance.address, adminAddress, usdcAddress);
  await rewardPoolInstance.deployed();

  console.log("StageContract deployed to:", nftInstance.address);
  console.log("RewardPool deployed to:", rewardPoolInstance.address);

  // Save the artifacts in the shared_json directory
  const directoryPath = path.join(__dirname, "../../src/shared_json");

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const nftArtifact = await hre.artifacts.readArtifact("StageContract");
  fs.writeFileSync(
    path.join(directoryPath, "StageContract.json"),
    JSON.stringify({
      address: nftInstance.address,
      abi: nftArtifact.abi
    })
  );

  const rewardPoolArtifact = await hre.artifacts.readArtifact("RewardPool");
  fs.writeFileSync(
    path.join(directoryPath, "RewardPool.json"),
    JSON.stringify({
      address: rewardPoolInstance.address,
      abi: rewardPoolArtifact.abi
    })
  );
}

// Handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
