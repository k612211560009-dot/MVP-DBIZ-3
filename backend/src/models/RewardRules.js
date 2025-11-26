const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RewardRules = sequelize.define(
    "RewardRules",
    {
      rule_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      action_type: {
        type: DataTypes.ENUM(
          "donation",
          "screening",
          "referral",
          "milestone",
          "survey_completion",
          "appointment_attendance"
        ),
        allowNull: false,
      },
      action_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      points_awarded: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      conditions: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      effective_from: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      effective_to: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      max_uses_per_donor: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      tableName: "reward_rules",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["action_type"],
        },
        {
          fields: ["is_active"],
        },
      ],
    }
  );

  RewardRules.associate = (models) => {
    // RewardRules has many point transactions
    RewardRules.hasMany(models.PointTransaction, {
      foreignKey: "rule_id",
      as: "pointTransactions",
    });
  };

  return RewardRules;
};

