const bcrypt = require("bcryptjs");

const password = "Staff123!@#";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log('Password hash for "Staff123!@#":');
  console.log(hash);

  // Test the hash
  bcrypt.compare(password, hash, function (err, result) {
    if (result) {
      console.log("✅ Hash verification: SUCCESS");
    } else {
      console.log("❌ Hash verification: FAILED");
    }
  });
});

const donorPassword = "Donor123!@#";
bcrypt.hash(donorPassword, saltRounds, function (err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log('\nPassword hash for "Donor123!@#":');
  console.log(hash);

  // Test the hash
  bcrypt.compare(donorPassword, hash, function (err, result) {
    if (result) {
      console.log("✅ Hash verification: SUCCESS");
    } else {
      console.log("❌ Hash verification: FAILED");
    }
  });
});
