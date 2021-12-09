
async function main() {
  const [deployer] = await ethers.getSigners();

  const Ballot = await ethers.getContractFactory("Ballot");
  const ballot = await Ballot.attach("0xF7064494c894BcF77161af4c8B9DA99a08314Fc8");

  console.log("Ballot address:", ballot.address);

  const result1 = await ballot.description();
  console.log(result1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });