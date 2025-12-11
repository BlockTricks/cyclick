const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy CyclickToken
  console.log("\n1. Deploying CyclickToken...");
  const CyclickToken = await hre.ethers.getContractFactory("CyclickToken");
  const cyclickToken = await CyclickToken.deploy(deployer.address);
  await cyclickToken.waitForDeployment();
  const tokenAddress = await cyclickToken.getAddress();
  console.log("CyclickToken deployed to:", tokenAddress);

  // Deploy RideVerifier
  console.log("\n2. Deploying RideVerifier...");
  const RideVerifier = await hre.ethers.getContractFactory("RideVerifier");
  const rideVerifier = await RideVerifier.deploy(tokenAddress, deployer.address);
  await rideVerifier.waitForDeployment();
  const verifierAddress = await rideVerifier.getAddress();
  console.log("RideVerifier deployed to:", verifierAddress);

  // Set RideVerifier in CyclickToken
  console.log("\n3. Setting RideVerifier in CyclickToken...");
  await cyclickToken.setRideVerifier(verifierAddress);
  console.log("RideVerifier set in CyclickToken");

  // Deploy CarbonCredits
  console.log("\n4. Deploying CarbonCredits...");
  const CarbonCredits = await hre.ethers.getContractFactory("CarbonCredits");
  const carbonCredits = await CarbonCredits.deploy(tokenAddress, deployer.address);
  await carbonCredits.waitForDeployment();
  const carbonCreditsAddress = await carbonCredits.getAddress();
  console.log("CarbonCredits deployed to:", carbonCreditsAddress);

  // Deploy NFTBadges
  console.log("\n5. Deploying NFTBadges...");
  const NFTBadges = await hre.ethers.getContractFactory("NFTBadges");
  const nftBadges = await NFTBadges.deploy(verifierAddress, deployer.address);
  await nftBadges.waitForDeployment();
  const nftBadgesAddress = await nftBadges.getAddress();
  console.log("NFTBadges deployed to:", nftBadgesAddress);

  // Set base URI for NFT badges (optional - can be set later)
  console.log("\n6. Setting base URI for NFT badges...");
  const baseURI = "https://ipfs.io/ipfs/"; // Update with your IPFS gateway
  await nftBadges.setBaseURI(baseURI);
  console.log("Base URI set to:", baseURI);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("CyclickToken:", tokenAddress);
  console.log("RideVerifier:", verifierAddress);
  console.log("CarbonCredits:", carbonCreditsAddress);
  console.log("NFTBadges:", nftBadgesAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    contracts: {
      CyclickToken: tokenAddress,
      RideVerifier: verifierAddress,
      CarbonCredits: carbonCreditsAddress,
      NFTBadges: nftBadgesAddress,
    },
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", deploymentPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



