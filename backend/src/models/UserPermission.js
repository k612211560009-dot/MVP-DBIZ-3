const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserPermission = sequelize.define(
    "UserPermission",
    {
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      permission_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "permissions",
          key: "permission_id",
        },
      },
      granted_by: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        comment: "User who granted this permission",
      },
      granted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Optional expiration date for temporary permissions",
      },
    },
    {
      tableName: "user_permissions",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "permission_id"],
          name: "unique_user_permission",
        },
        {
          fields: ["granted_by"],
        },
        {
          fields: ["expires_at"],
        },
      ],
    }
  );

  return UserPermission;
};

