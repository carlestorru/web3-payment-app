// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Factura {
    address payable public contratista;
    address public cliente;
    uint public montoTotal;
    uint public fechaVencimiento;
    bool public pagada;
    
    constructor(address _cliente, uint _montoTotal, uint _fechaVencimiento) {
        contratista = payable(msg.sender);
        cliente = _cliente;
        montoTotal = _montoTotal;
        fechaVencimiento = _fechaVencimiento;
        pagada = false;
    }
    
    function pagar() public payable {
        require(msg.sender == cliente, "Solo el cliente puede pagar la factura");
        require(msg.value == montoTotal, "El monto enviado debe ser igual al monto total de la factura");
        require(!pagada, "La factura ya ha sido pagada");
        
        contratista.transfer(msg.value);
        pagada = true;
    }
    
    function esAtrasada() public view returns(bool) {
        return block.timestamp > fechaVencimiento && !pagada;
    }
}
