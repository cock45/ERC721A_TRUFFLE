module.exports = (sequelize, Sequelize) => {
    const WhiteList = sequelize.define("whitelist", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      address: {
        type: Sequelize.STRING,
        unique: true,
      },
      // twitter_name: {
      //   type: Sequelize.STRING,
      //   unique: true,
      // },
      discord_name: {
        type: Sequelize.STRING,
        unique: true,
      },
      // email: {
      //   type: Sequelize.STRING,
      // }
    });
  
    return WhiteList;
  };