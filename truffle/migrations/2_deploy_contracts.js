// var HelloWorld = artifacts.require('./HelloWorld.sol');
var Invoices = artifacts.require('./Invoices.sol');
module.exports = function (deployer) {
	deployer.deploy(Invoices);
};
