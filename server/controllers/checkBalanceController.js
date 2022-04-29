const db = require("../models");
const BN = require("bn.js");
const User = db.users;
const Op = db.Sequelize.Op;
var Web3 = require("web3");
web3 = new Web3(
  new Web3.providers.HttpProvider(
    process.env.WEB3_PROVIDER_MORALIS_AVALANCHE_TESTNET
  )
);

exports.checkBalance = async (req, res, next) => {
  if (!req.body.address || !req.body.count) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  var balance;
  await web3.eth.getBalance(req.body.address, (err, bal) => {
    if (err) {
      return console.error(err);
    }
    balance = web3.utils.toBN(bal);
  });
  var nftValue = parseFloat(process.env.NFT_VALUE) * req.body.count;
  var nftWeiValue = web3.utils.toBN(
    web3.utils.toWei(nftValue.toString(), "ether").toString()
  );

  {
    if (nftWeiValue.cmp(balance) == 1) {
      res.json({
        success: false,
        msg: "Your Balance is not enough to mint. Please charge the money to your account!"
      });
    } else {
      res.json({
        success: true,
        nftValue: nftValue
      });
    }
  }

  //------------------for test---------------------
  // User.findOne({
  //   where: {
  //     address: req.body.address
  //   }
  // }).then(data => {
  //   if (data) {
  //     res.json({
  //       success: false,
  //       msg: "Your address is already registered"
  //     })
  //   } else {
  //     // if (nftWeiValue.cmp(balance) == 1) {
  //     //   res.json({
  //     //     success: false,
  //     //     msg: "Your Balance is not enough to mint"
  //     //   });
  //     // } else {
  //       res.json({
  //         success: true,
  //       });
  //     // }
  //   }
  // })
};
