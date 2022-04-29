const HeavyGunner = artifacts.require("HeavyGunner");

module.exports = function (deployer) {
  deployer.deploy(HeavyGunner, "https://ipfs.io/ipfs/QmZrUccAxJRMZaTcJQDyeoQiGyWr4FPnkvrTrnbZxwUVwB");
};
