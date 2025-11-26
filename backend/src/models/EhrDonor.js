const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EhrDonor = sequelize.define(
    "EhrDonor",
    {
      donor_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        references: {
          model: "donor",
          key: "donor_id",
        },
      },
      national_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ward: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      source_system: {
        type: DataTypes.STRING(255),
        defaultValue: "national_ehr",
      },
      last_fetched_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      hiv_result: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hiv_sample_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      hiv_valid_until: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      hbv_result: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hbv_sample_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      hbv_valid_until: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      hcv_result: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hcv_sample_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      hcv_valid_until: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      syphilis_result: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      syphilis_sample_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      syphilis_valid_until: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      htlv_result: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      htlv_sample_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      htlv_valid_until: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_clear: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      raw_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "EHR_DONOR",
      timestamps: true,
      createdAt: false,
      updatedAt: "updated_at",
    }
  );

  EhrDonor.associate = (models) => {
    // EhrDonor belongs to Donor (1:1 relationship)
    EhrDonor.belongsTo(models.Donor, {
      foreignKey: "donor_id",
      as: "donor",
    });
  };

  return EhrDonor;
};
