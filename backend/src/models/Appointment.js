const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      appointment_id: {
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
      bank_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "milk_banks",
          key: "bank_id",
        },
      },
      appointment_type: {
        type: DataTypes.ENUM(
          "screening",
          "donation",
          "medical_test",
          "consultation"
        ),
        allowNull: false,
      },
      appointment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time_slot: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "scheduled",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
          "no_show"
        ),
        defaultValue: "scheduled",
      },
      priority_level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: "1=low, 2=normal, 3=high, 4=urgent",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      preparation_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      meeting_link: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "Video meeting link for screening interviews",
      },
      reminder_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      cancelled_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "appointments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["donor_id"],
        },
        {
          fields: ["bank_id"],
        },
        {
          fields: ["appointment_date"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["appointment_type"],
        },
      ],
    }
  );

  Appointment.associate = (models) => {
    // Appointment belongs to Donor
    Appointment.belongsTo(models.Donor, {
      foreignKey: "donor_id",
      as: "donor",
    });

    // Appointment belongs to MilkBank
    Appointment.belongsTo(models.MilkBank, {
      foreignKey: "bank_id",
      as: "milkBank",
    });

    // Appointment belongs to User (creator)
    Appointment.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });

    // Appointment has many screening sessions
    Appointment.hasMany(models.ScreeningSession, {
      foreignKey: "appointment_id",
      as: "screeningSessions",
    });

    // Appointment has many medical tests
    Appointment.hasMany(models.MedicalTest, {
      foreignKey: "appointment_id",
      as: "medicalTests",
    });
  };

  return Appointment;
};
