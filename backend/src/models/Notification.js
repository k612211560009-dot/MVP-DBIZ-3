const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      notification_id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "medium",
      },
      status: {
        type: DataTypes.ENUM("unread", "read", "resolved"),
        defaultValue: "unread",
      },
      related_donor_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      related_entity_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      related_entity_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resolved_by: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.Donor, {
      foreignKey: "related_donor_id",
      as: "donor",
    });
    Notification.belongsTo(models.User, {
      foreignKey: "resolved_by",
      as: "resolver",
    });
  };

  return Notification;
};
