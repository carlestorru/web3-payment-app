// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RequestMoney {
    struct Request {
        address answerAddress;
        address payAddress;
        uint256 amount;
        string concept;
    }

    mapping(address => Request[]) public requests;

    function insertRequest(address _answerAddress, address _payAddress, uint256 _amount, string memory _concept) public {
        Request memory newRequest = Request(_answerAddress, _payAddress, _amount, _concept);
        requests[_payAddress].push(newRequest);
    }

    function getUserRequests(address _payAddress) public view returns (address[] memory, uint256[] memory, string[] memory) {
        uint arrayLen = requests[_payAddress].length;
        address[] memory addresses = new address[](arrayLen);
        uint256[] memory amounts = new uint256[](arrayLen);
        string[] memory concepts = new string[](arrayLen);
        for (uint i = 0; i < arrayLen; i++) {
            Request storage request = requests[_payAddress][i];
            addresses[i] = request.answerAddress;
            amounts[i] = request.amount;
            concepts[i] = request.concept;
        }
        return (addresses, amounts, concepts);
    }
}

