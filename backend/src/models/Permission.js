const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Permission = sequelize.define(
    "Permission",
    {
      permission_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      resource: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "Resource type (e.g., donor, appointment, report)",
      },
      action: {
        type: DataTypes.ENUM(
          "create",
          "read",
          "update",
          "delete",
          "manage",
          "approve"
        ),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "permissions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["resource", "action"],
          name: "unique_resource_action",
        },
      ],
    }
  );

  // Associations
  Permission.associate = (models) => {
    Permission.belongsToMany(models.User, {
      through: "user_permissions",
      foreignKey: "permission_id",
      otherKey: "user_id",
      as: "users",
    });
  };

  return Permission;
};

