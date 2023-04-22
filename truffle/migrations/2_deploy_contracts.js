// var HelloWorld = artifacts.require('./HelloWorld.sol');
var Factura = artifacts.require('./Factura.sol');
module.exports = function (deployer) {
	deployer.deploy(Factura);
};
