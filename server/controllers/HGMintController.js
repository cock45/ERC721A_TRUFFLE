const db = require("../models");
const Whitelist = db.users;
// const MintHistory = db.minthistory;
const dotenv = require("dotenv");
dotenv.config();
var Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    process.env.WEB3_PROVIDER_MORALIS_AVALANCHE_TESTNET
  )
);
const HGNFT = require("../abi/HeavyGunner.json");
const contract = new web3.eth.Contract(
  HGNFT.abi,
  process.env.CONTRACT_ADDRESS_MAINNET
);
const sequelize = require("sequelize");
const Op = sequelize.Op;
const Account = require("eth-lib/lib/account");
const ethereumjsUtil = require("ethereumjs-util");

exports.checkMintable = async (req, res, next) => {
  if (!req.body.address) {
    res.status(400).send({
      success: false,
      message: "Content can not be empty!",
    });
    return;
  }

  const totalToken = await contract.methods.totalToken().call();
  if (totalToken < parseInt(process.env.TOKEN_ID_END)) {
     if (process.env.WHITELISTSALE == "true") {
      const user = await Whitelist.findOne({
        where: { address: req.body.address },
      });

      if (user) {
        try {
          const tokens = await contract.methods
            .walletOfOwner(req.body.address)
            .call();
          const curColTokens = tokens.filter(
            (token) =>
              parseInt(token) >= parseInt(process.env.TOKEN_ID_START) &&
              parseInt(token) <= parseInt(process.env.TOKEN_ID_END)
          );
          if (curColTokens.length < parseInt(process.env.PRESALE_MAX_MINT)) {
            res.json({
              success: true,
              count:
                parseInt(process.env.PRESALE_MAX_MINT) - curColTokens.length,
            });
          } else {
            // console.log(curColTokens.length);
            res.json({
              success: false,
              minted: true,
              message: "Congrats, you already minted all your tokens!",
            });
          }
        } catch {
          res.json({
            success: false,
            message: "Sorry, please try again later.",
          });
        }
      } else {
        res.json({
          success: false,
          message: "Sorry, we cannot find your record on our whitelist.",
        });
      }
    } else {
      try {
        const tokens = await contract.methods
          .walletOfOwner(req.body.address)
          .call();
        const curColTokens = tokens.filter(
          (token) =>
            parseInt(token) >= parseInt(process.env.TOKEN_ID_START) &&
            parseInt(token) <= parseInt(process.env.TOKEN_ID_END)
        );
        if (curColTokens.length >= parseInt(process.env.PUBLICSALE_MAX_MINT)) {
          res.json({
            success: false,
            minted: true,
            message: "Congrats, you already minted all your tokens!",
          });
        } else {
          res.json({
            success: true,
            count:
              parseInt(process.env.PUBLICSALE_MAX_MINT) - curColTokens.length,
          });
        }
      } catch {
        res.json({
          success: false,
          message: "Sorry, please try again later.",
        });
      }
    }
  } else {
    res.json({
      success: false,
      soldout: true,
      message: "All tokens sold out in this collection.",
    });
  }
};

exports.getMintData = async (req, res, next) => {
  if (!req.body.address || !req.body.count) {
    res.status(400).send({
      success: false,
      message: "Content can not be empty!",
    });
    return;
  }

  {
    const totalToken = await contract.methods.totalToken().call();
    if (totalToken < parseInt(process.env.TOKEN_ID_END)) {
      if (process.env.WHITELISTSALE == "true") {
        const user = await Whitelist.findOne({
          where: { address: req.body.address },
        });
        if (user) {
          try {
            const tokens = await contract.methods
              .walletOfOwner(req.body.address)
              .call();
            const curColTokens = tokens.filter(
              (token) =>
                parseInt(token) >= parseInt(process.env.TOKEN_ID_START) &&
                parseInt(token) <= parseInt(process.env.TOKEN_ID_END)
            );
            if (
              curColTokens.length + parseInt(req.body.count) >
              process.env.WHITELIST_MAX_MINT
            ) {
              res.json({
                success: false,
                message: `Sorry, your request is out of range! You already mint ${curColTokens.length
                  }. You can only mint ${process.env.WHITELIST_MAX_MINT - curColTokens.length
                  }!`,
              });
              return;
            }
          } catch {
            res.json({
              success: false,
              message: "Sorry, please try again later.",
            });
            return;
          }
        } else {
          res.json({
            success: false,
            message:
              "Sorry, we cannot find your record on our whitelist. You are not whitelist user! Please join our whitelist first!",
          });
          return;
        }
      } else {
        try {
          const tokens = await contract.methods
            .walletOfOwner(req.body.address)
            .call();
          const curColTokens = tokens.filter(
            (token) =>
              parseInt(token) >= parseInt(process.env.TOKEN_ID_START) &&
              parseInt(token) <= parseInt(process.env.TOKEN_ID_END)
          );
          if (
            curColTokens.length + parseInt(req.body.count) >
            parseInt(process.env.PUBLICSALE_MAX_MINT)
          ) {
            res.json({
              success: false,
              message: "Sorry, your request is out of range!",
            });
            return;
          }
        } catch {
          res.json({
            success: false,
            message: "Sorry, please try again later.",
          });
          return;
        }
      }
    } else {
      res.json({
        success: false,
        message: "Sorry, all tokens sold out in this collection.",
      });
      return;
    }

    // MintHistory.create({ address: req.body.address, timestamp: parseInt(new Date().getTime() / 1000), count: req.body.count });

    // const timestamp = parseInt(new Date().getTime() / 1000);

    // // Data Pack
    // const data = web3.eth.abi.encodeParameters(
    //     ['address', 'uint256', 'uint256'],
    //     [req.body.address, parseInt(req.body.count), timestamp]
    // );

    // // Signature Generate
    // const messageHex = web3.utils.isHexStrict(data) ? data : web3.utils.utf8ToHex(data);
    // const messageBytes = web3.utils.hexToBytes(messageHex);
    // const messageBuffer = Buffer.from(messageBytes);
    // const hash = ethereumjsUtil.bufferToHex(ethereumjsUtil.keccak256(messageBuffer));
    // // const signature = Account.sign(hash, process.env.PRIVATE_KEY);
    res.json({
      success: true,
      tokenAmount: parseInt(req.body.count),
      // timestamp: timestamp,
      // signature: signature,
      price: process.env.CURRENT_NFT,
    });
  }
};
exports.getTotalMintedCount = async (req, res, next) => {
  const totalToken = await contract.methods.totalToken().call();
  res.json({
    success: true,
    totalCount: totalToken
  })
};