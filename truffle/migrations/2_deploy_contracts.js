// var HelloWorld = artifacts.require('./HelloWorld.sol');
var RequestMoney = artifacts.require('./RequestMoney.sol');
module.exports = function (deployer) {
	deployer.deploy(RequestMoney);
};
