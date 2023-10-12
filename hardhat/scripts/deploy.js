const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const tokenAddress = "0xB0514D3292720365d178af5b46952b04cFF06345"; // <-- OAS sandverse
  const adminAddress = process.env.OWNER_ADDRESS; // Make sure to set this in your .env file

  // Deploy TicketPlatform
  const TicketPlatform = await hre.ethers.getContractFactory("TicketPlatform");
  const ticketInstance = await TicketPlatform.deploy(tokenAddress);
  await ticketInstance.deployed();
  console.log("TicketPlatform deployed to:", ticketInstance.address);

  // Deploy StageContract
  const StageContract = await hre.ethers.getContractFactory("StageContract");
  const stageInstance = await StageContract.deploy();
  await stageInstance.deployed();
  console.log("StageContract deployed to:", stageInstance.address);

  // Deploy RewardPool
  const RewardPool = await hre.ethers.getContractFactory("RewardPool");
  const rewardInstance = await RewardPool.deploy(stageInstance.address, ticketInstance.address, tokenAddress);
  await rewardInstance.deployed();
  console.log("RewardPool deployed to:", rewardInstance.address);

  // Save the artifacts in the shared_json directory
  const directoryPath = path.join(__dirname, "../../src/shared_json");
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Save TicketPlatform artifact
  const ticketArtifact = await hre.artifacts.readArtifact("TicketPlatform");
  fs.writeFileSync(
    path.join(directoryPath, "TicketPlatform.json"),
    JSON.stringify({
      address: ticketInstance.address,
      abi: ticketArtifact.abi
    })
  );

  // Save StageContract artifact
  const stageArtifact = await hre.artifacts.readArtifact("StageContract");
  fs.writeFileSync(
    path.join(directoryPath, "StageContract.json"),
    JSON.stringify({
      address: stageInstance.address,
      abi: stageArtifact.abi
    })
  );

  // Save RewardPool artifact
  const rewardArtifact = await hre.artifacts.readArtifact("RewardPool");
  fs.writeFileSync(
    path.join(directoryPath, "RewardPool.json"),
    JSON.stringify({
      address: rewardInstance.address,
      abi: rewardArtifact.abi
    })
  );

  // set ticket price
  await ticketInstance.setTicketPrice(
    "player_ticket", // _ticketName
    "https://bafybeie5l4nwfz3rt5kvfuafsz5obiwmfz2artg3vsihowheuyox3yvtry.ipfs.w3s.link/player_ticket.png", // _ticketImageURL
    "This is a player ticket", // _ticketDescription
    1, // _ticketType
    hre.ethers.utils.parseEther("1"), // _ticketPrice
    0, // _ticketMaxNum
    false, // _isTicketRange
  );

  await ticketInstance.setTicketPrice(
    "creater_ticket", // _ticketName
    "https://bafybeiem55c2voshcurz6mhmqdvwb2mwmr3lwut7lh3cuajj3ykngkph7a.ipfs.w3s.link/creater_ticket.png", // _ticketImageURL
    "This is a creater ticket",// _ticketDescription
    0, // _ticketType
    hre.ethers.utils.parseEther("20"), // _ticketPrice
    0, // _ticketMaxNum
    false, // _isTicketRange
  );
  console.log("ticketInstance initial data deployed");
}

// Handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
