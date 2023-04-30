// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Invoice {
    address payable private contractor;
    address private client;
    string private articles;
    uint256 private total;
    string private message;
    uint private dueDate;
    string private discount;
    string private otherImport;
    bool private isPaid;

    constructor(address _client, string memory _articles, uint256 _total, uint _dueDate, string memory _message, string memory _discount, string memory _otherImport) {
        contractor = payable(msg.sender);
        client = _client;
        articles = _articles;
        total = _total;
        message = _message;
        dueDate = _dueDate;
        discount = _discount;
        otherImport = _otherImport;
        isPaid = false;
    }
    
    function pay() public payable {
        require(msg.sender == client, "Solo el cliente puede pagar la factura");
        require(msg.value == total, "El monto enviado debe ser igual al monto total de la factura");
        require(!isPaid, "La factura ya ha sido pagada");
        
        contractor.transfer(msg.value);
        isPaid = true;
    }
    
    function isOverdue() public view returns(bool) {
        require(msg.sender == client || msg.sender == contractor, "Solo las partes implicadas puedes obtener los datos de la factura");
        return block.timestamp > dueDate && !isPaid;
    }
    
    function getInfo() public view returns (address, address, string memory, uint256, string memory, uint, string memory, string memory) {
        require(msg.sender == client || msg.sender == contractor, "Solo las partes implicadas puedes obtener los datos de la factura");
        return (contractor, client, articles, total, message, dueDate, discount, otherImport);
    }
}
