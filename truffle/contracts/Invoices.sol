// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Invoices {
    mapping(address => string[]) public invoices;

    function insertInvoice(address _payAddress, string memory _contractAddress) public {
        invoices[_payAddress].push(_contractAddress);
    }

    function getUserInvoices(address _payAddress) public view returns (string[] memory) {
        return invoices[_payAddress];
    }

    function deleteUserInvoice(address _payAddress, uint _index) public {
        uint arrayLen = invoices[_payAddress].length;
        for (uint i = _index; i < arrayLen - 1; i++) {
            invoices[_payAddress][i] = invoices[_payAddress][i + 1];
        }
        invoices[_payAddress].pop();
    }
}