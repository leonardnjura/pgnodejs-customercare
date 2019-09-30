module.exports = (sequelize, DataTypes) => {
  const Personnel = sequelize.define(
    'Personnel',
    {
      personnel_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      personnel_onames: DataTypes.STRING,
      personnel_fname: DataTypes.STRING,
      personnel_email: DataTypes.STRING,
      personnel_phone: DataTypes.STRING,
      personnel_password: DataTypes.STRING,
      personnel_status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      last_login: DataTypes.DATE,
      personnel_type_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      reset_password: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    },
    {}
  );
  Personnel.associate = function(models) {
    // associations can be defined here
  };
  return Personnel;
};
