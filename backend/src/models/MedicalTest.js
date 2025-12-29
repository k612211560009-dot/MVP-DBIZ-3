const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MedicalTest = sequelize.define(
    "MedicalTest",
    {
      test_id: {
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
      donation_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "donation_records",
          key: "donation_id",
        },
      },
      test_type: {
        type: DataTypes.ENUM(
          "blood_screening",
          "infectious_disease",
          "general_health",
          "milk_quality"
        ),
        allowNull: false,
      },
      test_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      test_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      results: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "in_progress", "completed", "failed"),
        defaultValue: "pending",
      },
      normal_range: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      interpretation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lab_technician: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      external_lab_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      report_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      reviewed_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      follow_up_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      follow_up_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "medical_tests",
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
          fields: ["donation_id"],
        },
        {
          fields: ["test_type"],
        },
        {
          fields: ["test_date"],
        },
        {
          fields: ["status"],
        },
      ],
    }
  );

  MedicalTest.associate = (models) => {
    // MedicalTest belongs to Donor
    MedicalTest.belongsTo(models.Donor, {
      foreignKey: "donor_id",
      as: "donor",
    });

    // MedicalTest belongs to Appointment
    MedicalTest.belongsTo(models.Appointment, {
      foreignKey: "appointment_id",
      as: "appointment",
    });

    // MedicalTest belongs to DonationVisit
    MedicalTest.belongsTo(models.DonationVisit, {
      foreignKey: "visit_id",
      as: "donationVisit",
    });

    // MedicalTest belongs to User (reviewer)
    MedicalTest.belongsTo(models.User, {
      foreignKey: "reviewed_by",
      as: "reviewer",
    });
  };

  return MedicalTest;
};
