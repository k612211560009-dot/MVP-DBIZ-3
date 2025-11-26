import { sequelize } from "../models/index.js";
import { seedPermissions, assignRolePermissions } from "./permissionSeeder.js";
import { fileURLToPath } from "url";

/**
 * Database seeder - creates sample data for development
 */

const seedData = {
  users: [
    {
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      email: "admin@milkbank.com",
      password_hash:
        "$2a$12$HkfY1mP8WOa2n1HKSnRGXu4xAwAo3.PQpuEjEdT0JNv3ztk/XHy6W", // password123
      name: "System Administrator",
      role: "admin_staff",
      is_active: true,
      email_verified: true,
    },
    {
      email: "manager@milkbank.com",
      password_hash:
        "$2a$12$HkfY1mP8WOa2n1HKSnRGXu4xAwAo3.PQpuEjEdT0JNv3ztk/XHy6W", // password123
      name: "Milk Bank Manager",
      role: "milk_bank_manager",
      is_active: true,
      email_verified: true,
    },
    {
      user_id: "550e8400-e29b-41d4-a716-446655440003",
      email: "staff@milkbank.com",
      password_hash:
        "$2a$12$HkfY1mP8WOa2n1HKSnRGXu4xAwAo3.PQpuEjEdT0JNv3ztk/XHy6W", // password123
      name: "Staff Member",
      role: "medical_staff",
      is_active: true,
      email_verified: true,
    },
    {
      user_id: "550e8400-e29b-41d4-a716-446655440004",
      email: "donor1@example.com",
      password_hash:
        "$2a$12$HkfY1mP8WOa2n1HKSnRGXu4xAwAo3.PQpuEjEdT0JNv3ztk/XHy6W", // password123
      name: "Test Donor",
      role: "donor",
      is_active: true,
      email_verified: true,
    },
  ],

  milkBanks: [
    {
      bank_id: "550e8400-e29b-41d4-a716-446655440101",
      name: "Central Milk Bank HCMC",
      province: "Ho Chi Minh City",
      address: "District 1, Ho Chi Minh City",
    },
  ],

  donors: [
    {
      donor_id: "550e8400-e29b-41d4-a716-446655440004",
      home_bank_id: "550e8400-e29b-41d4-a716-446655440101",
      date_of_birth: "1990-06-15",
      address: "123 Main Street, District 1, HCMC",
      emergency_contact: JSON.stringify({
        name: "Husband Name",
        phone: "+84-123-456-789",
        relationship: "spouse",
      }),
      donor_status: "active",
      screening_status: "approved",
      director_status: "approved",
      registration_step: 10,
      points_total: 250,
    },
  ],

  rewardRules: [
    {
      rule_id: "550e8400-e29b-41d4-a716-446655440201",
      action_type: "donation",
      action_description: "Points for milk donation",
      points_awarded: 10,
      conditions: JSON.stringify({ minimum_volume_ml: 50 }),
      is_active: true,
      priority: 1,
    },
    {
      rule_id: "550e8400-e29b-41d4-a716-446655440202",
      action_type: "screening",
      action_description: "Completion bonus for screening",
      points_awarded: 50,
      is_active: true,
      priority: 2,
    },
  ],
};

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create users
    await sequelize.models.User.bulkCreate(seedData.users, {
      ignoreDuplicates: true,
    });
    console.log("✅ Users seeded");

    // Create milk banks
    await sequelize.models.MilkBank.bulkCreate(seedData.milkBanks, {
      ignoreDuplicates: true,
    });
    console.log("✅ Milk banks seeded");

    // Create donors
    await sequelize.models.Donor.bulkCreate(seedData.donors, {
      ignoreDuplicates: true,
    });
    console.log("✅ Donors seeded");

    // Create reward rules (commented out - table doesn't exist in current schema)
    // await sequelize.models.RewardRules.bulkCreate(seedData.rewardRules, {
    //   ignoreDuplicates: true,
    // });
    // console.log("✅ Reward rules seeded");

    // Seed permissions and role assignments
    await seedPermissions();
    await assignRolePermissions();

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Test accounts created:");
    console.log("- Admin Staff: admin@milkbank.com / password123");
    console.log("- Milk Bank Manager: manager@milkbank.com / password123");
    console.log("- Medical Staff: staff@milkbank.com / password123");
    console.log("- Donor: donor1@example.com / password123");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}

// Run seeder if called directly
const __filename = fileURLToPath(import.meta.url);
if (
  typeof globalThis !== "undefined" &&
  globalThis.process &&
  globalThis.process.argv &&
  globalThis.process.argv[1] === __filename
) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed successfully");
      if (
        typeof globalThis !== "undefined" &&
        globalThis.process &&
        typeof globalThis.process.exit === "function"
      )
        globalThis.process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      if (
        typeof globalThis !== "undefined" &&
        globalThis.process &&
        typeof globalThis.process.exit === "function"
      )
        globalThis.process.exit(1);
    });
}

export { seedDatabase, seedData };
