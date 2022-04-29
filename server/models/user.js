module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
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
      email: {
        type: Sequelize.STRING,
      },
      max_mint: {
        type: Sequelize.INTEGER,
        defaultValue: 3
      }
    });
    return Users;
  };