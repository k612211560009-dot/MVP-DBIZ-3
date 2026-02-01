// Test login API
const https = require("https");
const http = require("http");

async function testLogin(email, password, role) {
  try {
    console.log(`\n🧪 Testing ${role} login: ${email}`);

    const postData = JSON.stringify({ email, password });

    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    return new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const result = JSON.parse(data);

            if (res.statusCode === 200) {
              console.log("✅ Login successful!");
              console.log("Token:", result.token ? "Generated" : "Missing");
              console.log("User:", result.user?.name);
              console.log("Role:", result.user?.role);
            } else {
              console.log("❌ Login failed!");
              console.log("Status:", res.statusCode);
              console.log("Error:", result.message || result.error);
            }

            resolve(result);
          } catch (e) {
            console.log("❌ Parse error:", e.message);
            console.log("Response:", data);
            resolve(null);
          }
        });
      });

      req.on("error", (error) => {
        console.log("❌ Request failed:", error.message);
        resolve(null);
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.log("❌ Error:", error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Starting login tests...");
  console.log("Backend: http://localhost:5000");

  // Test donor login
  await testLogin("donor001@example.com", "Donor123!@#", "Donor");

  // Test staff login
  await testLogin("staff001@milkbank.com", "Staff123!@#", "Staff");

  // Test wrong password
  await testLogin(
    "donor001@example.com",
    "wrongpassword",
    "Donor (wrong password)"
  );
}

main();
