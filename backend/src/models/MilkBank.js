const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MilkBank = sequelize.define(
    "MilkBank",
    {
      bank_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "MILK_BANK",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false, // No updated_at column in actual schema
    }
  );

  MilkBank.associate = (models) => {
    // MilkBank has many donors
    MilkBank.hasMany(models.Donor, {
      foreignKey: "home_bank_id",
      as: "donors",
    });

    // MilkBank has many appointments
    MilkBank.hasMany(models.Appointment, {
      foreignKey: "bank_id",
      as: "appointments",
    });
  };

  return MilkBank;
};
