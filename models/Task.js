module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      task_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: DataTypes.INTEGER,
      personnel_id: DataTypes.INTEGER,
      task_status_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      created: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      last_modified: DataTypes.DATE,
      in_progress: DataTypes.DATE,
      completed: DataTypes.DATE,
      deferred: DataTypes.DATE,
      customer_first_name: DataTypes.STRING,
      customer_last_name: DataTypes.STRING,
      customer_city: DataTypes.STRING,
      customer_username: DataTypes.STRING,
      inserted: DataTypes.DATE,
      personnel_first_name: DataTypes.STRING,
      personnel_other_name: DataTypes.STRING,
      personnel_phone: DataTypes.STRING,
      task_status_name: DataTypes.STRING,
      customer_location: DataTypes.STRING,
      customer_gender: DataTypes.STRING,
      customer_age: DataTypes.INTEGER,
      customer_access_code: DataTypes.INTEGER,
      customer_splash_page: DataTypes.INTEGER,
      customer_mpesa: DataTypes.INTEGER,
      customer_autoplay: DataTypes.INTEGER,
      customer_comments: DataTypes.STRING,
      customer_updated: DataTypes.DATE,
      customer_updated_by: DataTypes.INTEGER,
      agentId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER
    },
    {}
  );
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};
