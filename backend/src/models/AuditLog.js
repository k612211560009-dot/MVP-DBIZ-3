const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      log_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: true, // Can be null for system actions
        references: {
          model: "users",
          key: "user_id",
        },
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Action performed (login, logout, create_appointment, etc.)",
      },
      resource_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Type of resource affected (user, appointment, donor, etc.)",
      },
      resource_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
        comment: "ID of the affected resource",
      },
      old_values: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "JSON string of old values before change",
      },
      new_values: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "JSON string of new values after change",
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: "Client IP address (supports IPv6)",
      },
      user_agent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "Client user agent string",
      },
      status: {
        type: DataTypes.ENUM("success", "failure", "pending"),
        allowNull: false,
        defaultValue: "success",
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Error message if status is failure",
      },
      metadata: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Additional metadata as JSON string",
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "audit_logs",
      timestamps: false, // Using custom timestamp field
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["action"],
        },
        {
          fields: ["timestamp"],
        },
        {
          fields: ["resource_type", "resource_id"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["ip_address"],
        },
      ],
    }
  );

  // Associations
  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return AuditLog;
};

