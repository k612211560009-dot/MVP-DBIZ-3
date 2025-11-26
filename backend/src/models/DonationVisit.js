const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DonationVisit = sequelize.define(
    "DonationVisit",
    {
      visit_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      donor_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "donor",
          key: "donor_id",
        },
      },
      bank_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "milk_bank",
          key: "bank_id",
        },
      },
      scheduled_start: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      scheduled_end: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      origin: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "system|user|staff",
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "proposed",
        comment: "proposed|scheduled|confirmed|skipped|cancelled|completed",
      },
      health_status: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "good|bad|n/a",
      },
      health_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      volume_ml: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      container_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quality_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      points_awarded: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      recorded_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "user",
          key: "user_id",
        },
      },
    },
    {
      tableName: "DONATION_VISIT",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  DonationVisit.associate = (models) => {
    // DonationVisit belongs to Donor
    DonationVisit.belongsTo(models.Donor, {
      foreignKey: "donor_id",
      as: "donor",
    });

    // DonationVisit belongs to MilkBank
    DonationVisit.belongsTo(models.MilkBank, {
      foreignKey: "bank_id",
      as: "bank",
    });

    // DonationVisit belongs to User (recorded by)
    DonationVisit.belongsTo(models.User, {
      foreignKey: "recorded_by",
      as: "recorder",
    });

    // DonationVisit has one VisitSchedule
    DonationVisit.hasOne(models.VisitSchedule, {
      foreignKey: "visit_id",
      as: "schedule",
    });
  };

  return DonationVisit;
};
