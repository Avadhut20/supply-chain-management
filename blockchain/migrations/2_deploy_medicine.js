const MedicineTransactionManager = artifacts.require("MedicineTransactionManager");

module.exports = async function (deployer) {
  await deployer.deploy(MedicineTransactionManager);
};
