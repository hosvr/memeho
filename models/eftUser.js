const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('eftUser', {
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
      },
    displayName: { 
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}