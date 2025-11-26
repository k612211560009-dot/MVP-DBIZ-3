const { DataTypes } = require("sequelize");
const uuid = require("uuid");
const uuidv4 = uuid.v4;

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true, // Can be null for OAuth users
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      national_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM(
          "donor",
          "medical_staff",
          "admin_staff",
          "milk_bank_manager"
        ),
        allowNull: false,
        defaultValue: "donor",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "USER",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["email"],
        },
        {
          fields: ["role"],
        },
        {
          fields: ["national_id"],
        },
      ],
      hooks: {
        beforeCreate: (user) => {
          if (!user.user_id) {
            user.user_id = uuidv4();
          }
        },
      },
    }
  );

  User.associate = (models) => {
    // User has one Donor profile (for donor role)
    User.hasOne(models.Donor, {
      foreignKey: "donor_id",
      as: "donorProfile",
    });

    // User can be assigned to many appointments as medical staff
    User.hasMany(models.Appointment, {
      foreignKey: "medical_staff_id",
      as: "assignedAppointments",
    });

    // User can verify medical tests
    User.hasMany(models.MedicalTest, {
      foreignKey: "verified_by",
      as: "verifiedTests",
    });

    // User permissions - many-to-many relationship
    User.belongsToMany(models.Permission, {
      through: "user_permissions",
      foreignKey: "user_id",
      otherKey: "permission_id",
      as: "permissions",
    });

    // User audit logs
    User.hasMany(models.AuditLog, {
      foreignKey: "user_id",
      as: "auditLogs",
    });

    // User password history
    User.hasMany(models.PasswordHistory, {
      foreignKey: "user_id",
      as: "passwordHistory",
    });
  };

  return User;
};
