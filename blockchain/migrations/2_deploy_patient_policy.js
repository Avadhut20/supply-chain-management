const InsuranceManager = artifacts.require("InsuranceManager");
const PatientPolicy = artifacts.require("PatientPolicy");

module.exports = async function (deployer) {
  const insuranceManagerInstance = await InsuranceManager.deployed();
  await deployer.deploy(PatientPolicy, insuranceManagerInstance.address);
};
