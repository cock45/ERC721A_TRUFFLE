const db = require("../models");
const User = db.waitlist;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
dotenv.config();
const { Client, Intents } = require("discord.js");
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS);
const client = new Client({
  intents: myIntents
});

var initialized = false;

function discordReady(client) {
  if (initialized)
    return new Promise((resolve, reject) => {
      resolve();
    });
  return new Promise((resolve, reject) => {
    client.once("ready", async () => {
      initialized = true;
      console.log(`Logged in as ${client.user.tag}!`);
      resolve();
    });
  });
}

exports.discordVerify = async (req, res, next) => {
  if (!req.body.discordUserName) {
    res.status(400).send({
      message: "Discord Username can not be empty!"
    });
    return;
  }

  console.log(req.body.discordUserName);
  await Promise.all([
    discordReady(client),
    client.login(process.env.DISCORD_TOKEN)
  ]);

  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const members = await guild.members.fetch();
  const roles = await guild.roles.fetch();
  const checkMember = members.filter(
    (member) =>
    member &&
    member.user &&
    member.user.bot == false &&
    member.user.username + "#" + member.user.discriminator ==
    req.body.discordUserName
    );
    

  const role = guild.roles.cache.find(role => role.name === "HORSEMAN");
  /** level */
  const role_step1 =  guild.roles.cache.find(role => role.name === "HORSEMAN WL 1/2");
  /** invite */
  const role_step2 =  guild.roles.cache.find(role => role.name === "HORSEMAN WL 2/2");


  
  if (checkMember.size) {
    if(checkMember.first().roles.cache.has(role_step1.id) || checkMember.first().roles.cache.has(role_step2.id)){

      res.json({
        success: true
      });
    }
    else{
      res.json({
        success:false,
        msg: "You have no permission to join our whitelist! Please invite 20 peoples to our discord or reach lvl10!"
      })
    }
  } else {
    res.json({
      success: false,
      msg: "We cannot find your ID on our discord."
    });
  }


};
