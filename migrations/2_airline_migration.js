var Donacion = artifacts.require("./DonacionesContract.sol");

module.exports = function(deployer) {
  deployer.deploy(Donacion);
};
