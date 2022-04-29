const db = require("../models");
const Whitelist = db.whitelist;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
dotenv.config();

function addressCheck(address) {
  return new Promise((resolve, reject) => {
    Whitelist.findOne({
      where: {
        address: address,
      },
    }).then((data) => {
      if (data) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function twitterCheck(twitterUserName) {
  return new Promise((resolve, reject) => {
    Whitelist.findOne({
      where: {
        twitter_name: twitterUserName,
      },
    }).then((data) => {
      if (data) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function discordCheck(discordUserName) {
  return new Promise((resolve, reject) => {
    Whitelist.findOne({
      where: {
        discord_name: discordUserName,
      },
    }).then((data) => {
      if (data) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

exports.signUpWhitelist = async (req, res, next) => {
  if (!req.body.address || !req.body.discordUserName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  let checkAddress = await addressCheck(req.body.address);
  let checkDiscord = await discordCheck(req.body.discordUserName);
  if (!checkAddress && !checkDiscord) {
    res.json({
      success: false,
      msg: "Your address and discord ID are already exist in whitelist.",
    });
    return;
  }
  if (!checkAddress) {
    res.json({
      success: false,
      msg: "Your address already exist in whitelist.",
    });
  }

  if (!checkDiscord) {
    res.json({
      success: false,
      msg: "Your discord ID already exist in whitelist.",
    });
  }

  if (checkAddress == true && checkDiscord == true) {
    const user = {
      address: req.body.address,
      discord_name: req.body.discordUserName,
    };

    // ----------------Save Tutorial in the database-----------------
    Whitelist.create(user)
      .then((data) => {
        res.json({
          success: true,
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          checkAddress: checkAddress,
          // checkTwitter: checkTwitter,
          checkDiscord: checkDiscord,
          message: "DB Error.",
        });
      });
  }
};
exports.signUpWhitelistManually = async (req, res, next) => {
  if (!req.body.address) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  let checkAddress = await addressCheck(req.body.address);
  if (!checkAddress) {
    res.json({
      success: false,
      msg: "Your address is already exist in whitelist.",
    });
    return;
  } else {
    const user = {
      address: req.body.address,
    };

    // ----------------Save Tutorial in the database-----------------
    Whitelist.create(user)
      .then((data) => {
        res.json({
          success: true,
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          checkAddress: checkAddress,
          message: "DB Error.",
        });
      });
  }
};
