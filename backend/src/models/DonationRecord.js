const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DonationRecord = sequelize.define(
    "DonationRecord",
    {
      donation_id: {
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
      appointment_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "appointments",
          key: "appointment_id",
        },
      },
      donation_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      volume_collected: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      storage_location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      storage_container_ids: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      quality_checks: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      processing_status: {
        type: DataTypes.ENUM(
          "pending",
          "tested",
          "approved",
          "rejected",
          "distributed"
        ),
        defaultValue: "pending",
      },
      staff_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      temperature_log: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      batch_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      collected_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      tableName: "donation_records",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["donor_id"],
        },
        {
          fields: ["appointment_id"],
        },
        {
          fields: ["donation_date"],
        },
        {
          fields: ["processing_status"],
        },
      ],
    }
  );

  DonationRecord.associate = (models) => {
    // DonationRecord belongs to Donor
    DonationRecord.belongsTo(models.Donor, {
      foreignKey: "donor_id",
      as: "donor",
    });

    // DonationRecord belongs to Appointment
    DonationRecord.belongsTo(models.Appointment, {
      foreignKey: "appointment_id",
      as: "appointment",
    });

    // DonationRecord belongs to User (collector)
    DonationRecord.belongsTo(models.User, {
      foreignKey: "collected_by",
      as: "collector",
    });

    // DonationRecord has many medical tests
    DonationRecord.hasMany(models.MedicalTest, {
      foreignKey: "donation_id",
      as: "medicalTests",
    });
  };

  return DonationRecord;
};

