const { Sequelize } = require("sequelize");

// Test database connection
async function testConnection() {
  const config = require("../../config/config.js");
  const env = process.env.NODE_ENV || "development";
  const sequelize = new Sequelize(config[env]);

  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    // Test model loading
    const db = require("./index");
    console.log(
      "✅ Models loaded:",
      Object.keys(db).filter(
        (key) => key !== "sequelize" && key !== "Sequelize"
      )
    );

    await sequelize.close();
    return true;
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    return false;
  }
}

// Run the test if called directly
if (require.main === module) {
  testConnection().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testConnection;
