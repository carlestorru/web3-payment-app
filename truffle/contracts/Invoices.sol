// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Invoices {
    struct Invoice {
        string contractAddress;
        bool isPaid;
    }

    mapping(address => Invoice[]) public invoices;

    function insertInvoice(address _payAddress, string memory _contractAddress) public {
        Invoice memory newInvoice = Invoice( _contractAddress, false);
        invoices[_payAddress].push(newInvoice);
    }

    function getUserInvoices(address _payAddress) public view returns (string[] memory, bool[] memory) {
        uint arrayLen = invoices[_payAddress].length;
        string[] memory contractAddresses = new string[](arrayLen);
        bool[] memory arePaids = new bool[](arrayLen);
        for (uint i = 0; i < arrayLen; i++) {
            Invoice storage invoice = invoices[_payAddress][i];
            contractAddresses[i] = invoice.contractAddress;
            arePaids[i] = invoice.isPaid;
        }
        return (contractAddresses, arePaids);
    }

    function setPaidInvoice(address _payAddress, uint _index) public {
        invoices[_payAddress][_index].isPaid = true;
    }
}