const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Compile and deploy ObjectContract contract
  const ObjectContract = await hre.ethers.getContractFactory("ObjectContract");
  const initialPrice = Number(1 * 1000000); // Setting initial price to 1 ETH for example, you can change this
  const description = "This is an example NFT. We plan to hold some NFT colabolation to enhance gaming ecosystem.";
  const url = "bafybeietf73zv72wrfqwlrbdcocpk5uowdamngevukjyqhk5ino5q5s45m/dino_tomoone.png"; // Replace with your NFT image URL
  const maxTotalSupply = 100; // Change this value as per your requirements
  const usdcAddress = "0xB0514D3292720365d178af5b46952b04cFF06345";  // <-- OAS sandverse

  const nftInstance = await ObjectContract.deploy(initialPrice, description, url, maxTotalSupply, usdcAddress);
  await nftInstance.deployed();
  console.log("ObjectContract deployed to:", nftInstance.address);

  // Save the ObjectContract contract artifact in the shared_json directory
  const directoryPath = path.join(__dirname, "../../src/shared_json");
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  const nftArtifact = await hre.artifacts.readArtifact("ObjectContract");
  fs.writeFileSync(
    path.join(directoryPath, "ObjectContract.json"),
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
