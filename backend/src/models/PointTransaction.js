const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PointTransaction = sequelize.define(
    "PointTransaction",
    {
      transaction_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      donor_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "donors",
          key: "donor_id",
        },
      },
      rule_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "reward_rules",
          key: "rule_id",
        },
      },
      transaction_type: {
        type: DataTypes.ENUM("earn", "redeem", "adjustment", "expire"),
        allowNull: false,
      },
      points_change: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reference_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
      },
      reference_type: {
        type: DataTypes.ENUM(
          "appointment",
          "donation",
          "screening",
          "referral",
          "manual"
        ),
        allowNull: true,
      },
      processed_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      balance_after: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "point_transactions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["donor_id"],
        },
        {
          fields: ["rule_id"],
        },
        {
          fields: ["transaction_type"],
        },
        {
          fields: ["created_at"],
        },
      ],
    }
  );

  PointTransaction.associate = (models) => {
    // PointTransaction belongs to Donor
    PointTransaction.belongsTo(models.Donor, {
      foreignKey: "donor_id",
      as: "donor",
    });

    // PointTransaction belongs to RewardRules
    PointTransaction.belongsTo(models.RewardRules, {
      foreignKey: "rule_id",
      as: "rule",
    });

    // PointTransaction belongs to User (processor)
    PointTransaction.belongsTo(models.User, {
      foreignKey: "processed_by",
      as: "processor",
    });
  };

  return PointTransaction;
};

