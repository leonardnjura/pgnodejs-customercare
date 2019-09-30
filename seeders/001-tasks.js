require('dotenv').config();
const tasks = require('../utils/data/tasks.json');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Tasks', tasks.tasks);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Tasks', null);
  }
};
