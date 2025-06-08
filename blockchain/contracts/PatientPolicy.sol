// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./InsuranceManager.sol";

contract PatientPolicy {
    InsuranceManager public insuranceManager;

    mapping(address => uint[]) public purchasedPolicies;

    event PolicyPurchased(address indexed patient, uint indexed policyId);

    constructor(address _insuranceManagerAddress) {
        insuranceManager = InsuranceManager(_insuranceManagerAddress);
    }

    function purchasePolicy(uint _policyId) public payable {
        InsuranceManager.Policy memory policy = insuranceManager.getPolicy(_policyId);

        require(msg.value == policy.basePremium, "Incorrect premium sent");

        purchasedPolicies[msg.sender].push(_policyId);

        emit PolicyPurchased(msg.sender, _policyId);
    }

    function getMyPolicies(address _user) public view returns (uint[] memory) {
        return purchasedPolicies[_user];
    }
}
