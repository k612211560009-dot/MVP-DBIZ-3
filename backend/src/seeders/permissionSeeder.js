import { Permission, User, UserPermission } from "../models";

/**
 * Seed default permissions based on Business Rules
 */
const seedPermissions = async () => {
  try {
    // Default permissions based on Business Rules
    const defaultPermissions = [
      // Donor permissions
      { name: "view_own_profile", resource: "donor", action: "read" },
      { name: "edit_own_profile", resource: "donor", action: "update" },
      {
        name: "view_own_appointments",
        resource: "appointment",
        action: "read",
      },
      {
        name: "edit_own_appointments",
        resource: "appointment",
        action: "update",
      },
      {
        name: "cancel_own_appointments",
        resource: "appointment",
        action: "delete",
      },
      {
        name: "view_own_test_results",
        resource: "medical_test",
        action: "read",
      },
      { name: "view_rewards", resource: "reward", action: "read" },
      { name: "redeem_rewards", resource: "reward", action: "update" },

      // Medical Staff permissions
      { name: "view_appointments", resource: "appointment", action: "read" },
      {
        name: "manage_appointments",
        resource: "appointment",
        action: "manage",
      },
      { name: "view_donor_profiles", resource: "donor", action: "read" },
      { name: "fill_screening_form", resource: "screening", action: "create" },
      { name: "record_donations", resource: "donation", action: "create" },

      // Admin Staff permissions
      { name: "view_all_donors", resource: "donor", action: "read" },
      { name: "manage_donors", resource: "donor", action: "manage" },
      {
        name: "approve_test_results",
        resource: "medical_test",
        action: "approve",
      },
      { name: "manage_staff", resource: "user", action: "manage" },
      { name: "view_reports", resource: "report", action: "read" },
      { name: "export_reports", resource: "report", action: "create" },
      { name: "manage_permissions", resource: "permission", action: "manage" },

      // Milk Bank Manager permissions (includes all admin + approval)
      { name: "approve_donors", resource: "donor", action: "approve" },
      { name: "digital_signature", resource: "approval", action: "approve" },
      { name: "configure_rewards", resource: "reward", action: "manage" },
      { name: "system_settings", resource: "system", action: "manage" },
    ];

    console.log("🔑 Creating default permissions...");

    for (const permData of defaultPermissions) {
      await Permission.findOrCreate({
        where: { name: permData.name },
        defaults: {
          ...permData,
          description: `Auto-generated permission: ${permData.name}`,
          is_active: true,
        },
      });
    }

    console.log("✅ Default permissions created successfully");
  } catch (error) {
    console.error("❌ Error seeding permissions:", error);
    throw error;
  }
};

/**
 * Assign role-based permissions to users
 */
const assignRolePermissions = async () => {
  try {
    console.log("🔗 Assigning role-based permissions...");

    // Get permissions
    const permissions = await Permission.findAll();
    const permMap = permissions.reduce((acc, perm) => {
      acc[perm.name] = perm;
      return acc;
    }, {});

    // Role permission mappings based on Business Rules
    const rolePermissions = {
      donor: [
        "view_own_profile",
        "edit_own_profile",
        "view_own_appointments",
        "edit_own_appointments",
        "cancel_own_appointments",
        "view_own_test_results",
        "view_rewards",
        "redeem_rewards",
      ],
      medical_staff: [
        "view_appointments",
        "manage_appointments",
        "view_donor_profiles",
        "fill_screening_form",
        "record_donations",
      ],
      admin_staff: [
        "view_all_donors",
        "manage_donors",
        "approve_test_results",
        "manage_staff",
        "view_reports",
        "export_reports",
        "manage_permissions",
        // Also include medical staff permissions
        "view_appointments",
        "manage_appointments",
        "view_donor_profiles",
      ],
      milk_bank_manager: [
        // All permissions
        ...Object.keys(permMap),
      ],
    };

    // Get users by role
    const users = await User.findAll();

    for (const user of users) {
      const userPerms = rolePermissions[user.role] || [];

      for (const permName of userPerms) {
        const permission = permMap[permName];
        if (permission) {
          await UserPermission.findOrCreate({
            where: {
              user_id: user.user_id,
              permission_id: permission.permission_id,
            },
            defaults: {
              granted_by: user.user_id, // Self-assigned during seeding
              granted_at: new Date(),
            },
          });
        }
      }
    }

    console.log("✅ Role-based permissions assigned successfully");
  } catch (error) {
    console.error("❌ Error assigning role permissions:", error);
    throw error;
  }
};

export { seedPermissions, assignRolePermissions };
