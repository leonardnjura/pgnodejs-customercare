module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
      task_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: Sequelize.INTEGER,
      personnel_id: {
        type: Sequelize.INTEGER,
        // onDelete: 'CASCADE',
        references: {
          model: 'Personnels',
          key: 'personnel_id'
        }
      },
      task_status_id: Sequelize.INTEGER,
      task_status_id: Sequelize.INTEGER,
      created_by: Sequelize.INTEGER,
      created: Sequelize.DATE,
      modified_by: Sequelize.INTEGER,
      last_modified: Sequelize.DATE,
      in_progress: Sequelize.DATE,
      completed: Sequelize.DATE,
      deferred: Sequelize.DATE,
      customer_first_name: Sequelize.STRING,
      customer_last_name: Sequelize.STRING,
      customer_city: Sequelize.STRING,
      customer_username: Sequelize.STRING,
      inserted: Sequelize.DATE,
      personnel_first_name: Sequelize.STRING,
      personnel_other_name: Sequelize.STRING,
      personnel_phone: Sequelize.STRING,
      task_status_name: Sequelize.STRING,
      customer_location: Sequelize.STRING,
      customer_gender: Sequelize.STRING,
      customer_age: Sequelize.INTEGER,
      customer_access_code: Sequelize.INTEGER,
      customer_splash_page: Sequelize.INTEGER,
      customer_mpesa: Sequelize.INTEGER,
      customer_autoplay: Sequelize.INTEGER,
      customer_comments: Sequelize.STRING,
      customer_updated: Sequelize.DATE,
      customer_updated_by: Sequelize.INTEGER,
      agentId: Sequelize.INTEGER,
      customerId: Sequelize.INTEGER
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tasks');
  }
};
