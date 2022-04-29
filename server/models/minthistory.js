module.exports = (sequelize, Sequelize) => {
    const MintHistory = sequelize.define("minthistory", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      address: {
        type: Sequelize.STRING,
      },
      count: {
        type: Sequelize.INTEGER,
      },
      timestamp: {
          type: Sequelize.INTEGER,
      }
    });
  
    return MintHistory;
  };