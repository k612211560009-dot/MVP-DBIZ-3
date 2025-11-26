const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PasswordHistory = sequelize.define(
    "PasswordHistory",
    {
      history_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Historical password hash",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "password_history",
      timestamps: false, // Using custom created_at
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["created_at"],
        },
      ],
    }
  );

  // Associations
  PasswordHistory.associate = (models) => {
    PasswordHistory.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return PasswordHistory;
};

