const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('teamKill', {
    killer: {
      type: Sequelize.STRING,
      allowNull: false
      },
    victim: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    comment: Sequelize.TEXT,
    wipe: Sequelize.DATEONLY
  })
}