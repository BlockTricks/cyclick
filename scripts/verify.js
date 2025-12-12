const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  const deploymentPath = path.join(__dirname, "..", "deployments", `${network}.json`);

  if (!fs.existsSync(deploymentPath)) {
    console.error(`Deployment file not found: ${deploymentPath}`);
    console.error("Please deploy contracts first using: npm run deploy:mainnet");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const { contracts, deployer } = deploymentInfo;

  console.log("=== Verifying Contracts ===");
  console.log("Network:", network);
  console.log("Deployer:", deployer);
  console.log("");

  // Verify CyclickToken
  try {
    console.log("Verifying CyclickToken...");
    await hre.run("verify:verify", {
      address: contracts.CyclickToken,
      constructorArguments: [deployer],
    });
    console.log("✓ CyclickToken verified\n");
  } catch (error) {
    console.log("⚠ CyclickToken verification failed:", error.message, "\n");
  }

  // Verify RideVerifier
  try {
    console.log("Verifying RideVerifier...");
    await hre.run("verify:verify", {
      address: contracts.RideVerifier,
      constructorArguments: [contracts.CyclickToken, deployer],
    });
    console.log("✓ RideVerifier verified\n");
  } catch (error) {
    console.log("⚠ RideVerifier verification failed:", error.message, "\n");
  }

  // Verify CarbonCredits
  try {
    console.log("Verifying CarbonCredits...");
    await hre.run("verify:verify", {
      address: contracts.CarbonCredits,
      constructorArguments: [contracts.CyclickToken, deployer],
    });
    console.log("✓ CarbonCredits verified\n");
  } catch (error) {
    console.log("⚠ CarbonCredits verification failed:", error.message, "\n");
  }

  // Verify NFTBadges
  try {
    console.log("Verifying NFTBadges...");
    await hre.run("verify:verify", {
      address: contracts.NFTBadges,
      constructorArguments: [contracts.RideVerifier, deployer],
    });
    console.log("✓ NFTBadges verified\n");
  } catch (error) {
    console.log("⚠ NFTBadges verification failed:", error.message, "\n");
  }

  console.log("=== Verification Complete ===");
  
  // Get explorer URL based on network
  let explorerUrl = "";
  let explorerName = "";
  if (network === "celo") {
    explorerUrl = "https://celoscan.io/address/";
    explorerName = "CeloScan";
  } else if (network === "alfajores") {
    explorerUrl = "https://alfajores.celoscan.io/address/";
    explorerName = "CeloScan";
  } else if (network === "base") {
    explorerUrl = "https://basescan.org/address/";
    explorerName = "BaseScan";
  } else if (network === "baseSepolia") {
    explorerUrl = "https://sepolia.basescan.org/address/";
    explorerName = "BaseScan";
  }
  
  if (explorerUrl) {
    console.log(`\nView contracts on ${explorerName}:`);
    console.log(`CyclickToken: ${explorerUrl}${contracts.CyclickToken}`);
    console.log(`RideVerifier: ${explorerUrl}${contracts.RideVerifier}`);
    console.log(`CarbonCredits: ${explorerUrl}${contracts.CarbonCredits}`);
    console.log(`NFTBadges: ${explorerUrl}${contracts.NFTBadges}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


