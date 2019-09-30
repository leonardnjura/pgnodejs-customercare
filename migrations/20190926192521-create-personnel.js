module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Personnels', {
      personnel_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      personnel_onames: Sequelize.STRING,
      personnel_fname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      personnel_email: {
        type: Sequelize.STRING,
        unique: true
      },
      personnel_phone: Sequelize.STRING,
      personnel_password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      personnel_status: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      last_login: Sequelize.DATE,
      personnel_type_id: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      reset_password: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Personnels')
};
