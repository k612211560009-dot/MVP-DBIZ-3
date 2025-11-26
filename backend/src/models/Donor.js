const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Donor = sequelize.define(
    "Donor",
    {
      donor_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id",
        },
      },
      home_bank_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "milk_bank",
          key: "bank_id",
        },
      },
      donor_status: {
        type: DataTypes.STRING(255),
        defaultValue: "in_progress",
      },
      screening_status: {
        type: DataTypes.STRING(255),
        defaultValue: "pending",
      },
      director_status: {
        type: DataTypes.STRING(255),
        defaultValue: "pending",
      },
      consent_signed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      consent_method: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      weekly_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      preferred_start: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      preferred_end: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      max_visits_per_week: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
      },
      points_total: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "DONOR",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["donor_status"],
        },
        {
          fields: ["screening_status"],
        },
      ],
    }
  );

  Donor.associate = (models) => {
    // Donor belongs to User (1:1 relationship)
    Donor.belongsTo(models.User, {
      foreignKey: "donor_id",
      as: "user",
    });

    // Donor belongs to MilkBank
    Donor.belongsTo(models.MilkBank, {
      foreignKey: "home_bank_id",
      as: "homeBank",
    });

    // Donor has one EhrDonor (1:1 relationship)
    Donor.hasOne(models.EhrDonor, {
      foreignKey: "donor_id",
      as: "ehrData",
    });

    // Donor has many donation visits
    Donor.hasMany(models.DonationVisit, {
      foreignKey: "donor_id",
      as: "visits",
    });

    // Legacy associations (keep if old models still exist)
    if (models.Appointment) {
      Donor.hasMany(models.Appointment, {
        foreignKey: "donor_id",
        as: "appointments",
      });
    }

    if (models.ScreeningSession) {
      Donor.hasMany(models.ScreeningSession, {
        foreignKey: "donor_id",
        as: "screeningSessions",
      });
    }

    if (models.MedicalTest) {
      Donor.hasMany(models.MedicalTest, {
        foreignKey: "donor_id",
        as: "medicalTests",
      });
    }

    if (models.DonationRecord) {
      Donor.hasMany(models.DonationRecord, {
        foreignKey: "donor_id",
        as: "donationRecords",
      });
    }

    if (models.PointTransaction) {
      Donor.hasMany(models.PointTransaction, {
        foreignKey: "donor_id",
        as: "pointTransactions",
      });
    }
  };

  return Donor;
};
