require('dotenv').config();
const personnels = require('../utils/data/personnels.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Personnels', personnels.personnels);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Personnels', null);
  }
};
