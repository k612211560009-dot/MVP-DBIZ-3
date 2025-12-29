const bcrypt = require("bcryptjs");

const staffHash =
  "$2a$10$G38pfkduAS9iC7Y11hkWLuoVGfR0qNGkIDG67V/Hm0WlooLJSNMme";
const donorHash =
  "$2a$10$JyeZnhzh85PvAxS44pRyb.1mJFPjJhgXNkn.DG5qT32TcH9xntp5e";

console.log("Testing password hashes...\n");

// Test staff password
bcrypt.compare("Staff123!@#", staffHash, function (err, result) {
  console.log(
    'Staff password "Staff123!@#" matches:',
    result ? "✅ YES" : "❌ NO"
  );
  if (err) console.error("Error:", err);
});

// Test donor password
bcrypt.compare("Donor123!@#", donorHash, function (err, result) {
  console.log(
    'Donor password "Donor123!@#" matches:',
    result ? "✅ YES" : "❌ NO"
  );
  if (err) console.error("Error:", err);
});
