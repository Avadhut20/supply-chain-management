// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InsuranceManager {
    uint public policyCounter;

    struct Policy {
        uint policyId;
        string companyName;
        string policyName;
        string coverageInfo;
        uint basePremium;
        uint policyAmount;
        uint policyTenure;
        address insurer; // Address who created the policy
    }

    mapping(uint => Policy) public policies;

    event PolicyCreated(
        uint policyId,
        string companyName,
        string policyName,
        address insurer
    );

    function createPolicy(
        string memory _companyName,
        string memory _policyName,
        string memory _coverageInfo,
        uint _basePremium,
        uint _policyAmount,
        uint _policyTenure
    ) public {
        policies[policyCounter] = Policy({
            policyId: policyCounter,
            companyName: _companyName,
            policyName: _policyName,
            coverageInfo: _coverageInfo,
            basePremium: _basePremium,
            policyAmount: _policyAmount,
            policyTenure: _policyTenure,
            insurer: msg.sender
        });

        emit PolicyCreated(policyCounter, _companyName, _policyName, msg.sender);
        policyCounter++;
    }

    function getPolicy(uint _policyId) public view returns (Policy memory) {
        return policies[_policyId];
    }

    function getPolicyCount() public view returns (uint) {
        return policyCounter;
    }
}
