
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Ballot = await ethers.getContractFactory("Ballot");
  const ballot = await Ballot.deploy(ethers.utils.formatBytes32String("Community Test Proposal"), 
    "Increase active validator set in the current testnet", 
    [ethers.utils.formatBytes32String("Increase to 500 validators"), ethers.utils.formatBytes32String("Increase to 600 validators"), ethers.utils.formatBytes32String("Increase to 700 validators"), ethers.utils.formatBytes32String("Do not change anything")]
    );

  console.log("Ballot address:", ballot.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });