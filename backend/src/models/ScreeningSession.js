const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ScreeningSession = sequelize.define(
    "ScreeningSession",
    {
      session_id: {
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
      questionnaire_data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      interview_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      health_status: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      consent_signed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      consent_document_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      screening_result: {
        type: DataTypes.ENUM("passed", "failed", "pending_review"),
        allowNull: true,
      },
      reviewer_id: {
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
      next_steps: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "screening_sessions",
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
          fields: ["screening_result"],
        },
      ],
    }
  );

  ScreeningSession.associate = (models) => {
    // ScreeningSession belongs to Donor
    ScreeningSession.belongsTo(models.Donor, {
      foreignKey: "donor_id",
      as: "donor",
    });

    // ScreeningSession belongs to Appointment
    ScreeningSession.belongsTo(models.Appointment, {
      foreignKey: "appointment_id",
      as: "appointment",
    });

    // ScreeningSession belongs to User (reviewer)
    ScreeningSession.belongsTo(models.User, {
      foreignKey: "reviewer_id",
      as: "reviewer",
    });
  };

  return ScreeningSession;
};

