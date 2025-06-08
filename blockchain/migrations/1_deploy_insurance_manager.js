const InsuranceManager = artifacts.require("InsuranceManager");

module.exports = function (deployer) {
  deployer.deploy(InsuranceManager);
};
