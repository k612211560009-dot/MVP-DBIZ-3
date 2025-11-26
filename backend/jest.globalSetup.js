const { execSync } = require("child_process");

module.exports = async () => {
  try {
    // Ensure DB has baseline data before tests
    execSync("node src/seeders/index.js", { stdio: "inherit" });
  } catch (e) {
    // Let tests fail if seeding fails
    console.error("Seeding before tests failed:", e?.message || e);
  }
};
