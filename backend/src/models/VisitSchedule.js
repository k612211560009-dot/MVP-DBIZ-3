const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const VisitSchedule = sequelize.define(
    "VisitSchedule",
    {
      visit_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        references: {
          model: "donation_visit",
          key: "visit_id",
        },
      },
      plan_month: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "YYYY-MM planning cycle",
      },
      plan_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "monthly_day|monthly_nth_weekday|ad_hoc",
      },
      day_of_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "1–31; use last valid day if month shorter",
      },
      week_of_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "1–5 (1=first week)",
      },
      weekday: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "1=Mon..7=Sun",
      },
      window_start: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      window_end: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      proposed_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      proposed_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "user",
          key: "user_id",
        },
      },
      reschedule_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rule_snapshot: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "VISIT_SCHEDULE",
      timestamps: true,
      createdAt: false,
      updatedAt: "updated_at",
    }
  );

  VisitSchedule.associate = (models) => {
    // VisitSchedule belongs to DonationVisit (1:1 relationship)
    VisitSchedule.belongsTo(models.DonationVisit, {
      foreignKey: "visit_id",
      as: "visit",
    });

    // VisitSchedule belongs to User (proposed by)
    VisitSchedule.belongsTo(models.User, {
      foreignKey: "proposed_by",
      as: "proposer",
    });
  };

  return VisitSchedule;
};
