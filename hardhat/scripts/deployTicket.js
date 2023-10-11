const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Compile and deploy TicketPlatform contract
  const TicketPlatform = await hre.ethers.getContractFactory("TicketPlatform");
  const usdcAddress = "0xB0514D3292720365d178af5b46952b04cFF06345";  // <-- OAS sandverse

  const nftInstance = await TicketPlatform.deploy(usdcAddress);
  await nftInstance.deployed();
  console.log("TicketPlatform deployed to:", nftInstance.address);

  await nftInstance.setTicketPrice(
    0, // _ticketMaxNum
    hre.ethers.utils.parseEther("1"), // _ticketPrice
    false, // _isTicketRange
    "player_ticket", // _ticketName
    "https://bafybeie5l4nwfz3rt5kvfuafsz5obiwmfz2artg3vsihowheuyox3yvtry.ipfs.w3s.link/player_ticket.png", // _ticketImageURL
    "This is a player ticket" // _ticketDescription
  );

  await nftInstance.setTicketPrice(
    0, // _ticketMaxNum
    hre.ethers.utils.parseEther("20"), // _ticketPrice
    false, // _isTicketRange
    "creater_ticket", // _ticketName
    "https://bafybeiem55c2voshcurz6mhmqdvwb2mwmr3lwut7lh3cuajj3ykngkph7a.ipfs.w3s.link/creater_ticket.png", // _ticketImageURL
    "This is a creater ticket" // _ticketDescription
  );


  // Save the TicketPlatform contract artifact in the shared_json directory
  const directoryPath = path.join(__dirname, "../../src/shared_json");
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  const nftArtifact = await hre.artifacts.readArtifact("TicketPlatform");
  fs.writeFileSync(
    path.join(directoryPath, "TicketPlatform.json"),
    JSON.stringify({
      address: nftInstance.address,
      abi: nftArtifact.abi
    })
  );
}

// Handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
