import express from "express";
import cors from "cors";

const app = express();

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
  })
);

app.use(express.json());

// Mock database with pre-created staff accounts
const STAFF_ACCOUNTS = [
  {
    user_id: "staff-001",
    email: "medical.staff@milkbank.com",
    password: "StaffPassword123!", // In real app, this would be hashed
    name: "Dr. Medical Staff",
    role: "medical_staff",
  },
  {
    user_id: "director-001",
    email: "director@milkbank.com",
    password: "DirectorPassword123!",
    name: "Hospital Director",
    role: "director",
  },
];

// Mock registered donors (for testing)
const mockDonors = [];

// Test health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Test backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Test auth endpoints
app.post("/api/auth/register", (req, res) => {
  console.log("Registration attempt:", req.body);

  const { email, password, fullName, role } = req.body;

  // Only allow DONOR registration
  if (role !== "donor") {
    return res.status(403).json({
      error: "Registration denied",
      message: "Only donors can register. Staff accounts are created by admin.",
    });
  }

  // Check if email already exists
  if (mockDonors.find((d) => d.email === email)) {
    return res.status(400).json({
      error: "Registration failed",
      message: "Email already registered",
    });
  }

  // Create new donor
  const newDonor = {
    user_id: `donor-${Date.now()}`,
    email,
    password, // In real app, this would be hashed
    name: fullName,
    role: "donor",
  };

  mockDonors.push(newDonor);

  // Mock successful registration
  res.json({
    success: true,
    message: "Donor registered successfully",
    user: {
      user_id: newDonor.user_id,
      email: newDonor.email,
      name: newDonor.name,
      role: newDonor.role,
    },
  });
});

app.post("/api/auth/login", (req, res) => {
  console.log("Login attempt:", req.body);

  const { email, password } = req.body;

  // Check staff accounts first
  const staffAccount = STAFF_ACCOUNTS.find(
    (acc) => acc.email === email && acc.password === password
  );

  if (staffAccount) {
    return res.json({
      success: true,
      message: "Staff login successful",
      user: {
        user_id: staffAccount.user_id,
        email: staffAccount.email,
        name: staffAccount.name,
        role: staffAccount.role,
      },
      accessToken: `staff-token-${Date.now()}`,
    });
  }

  // Check donor accounts
  const donorAccount = mockDonors.find(
    (acc) => acc.email === email && acc.password === password
  );

  if (donorAccount) {
    return res.json({
      success: true,
      message: "Donor login successful",
      user: {
        user_id: donorAccount.user_id,
        email: donorAccount.email,
        name: donorAccount.name,
        role: donorAccount.role,
      },
      accessToken: `donor-token-${Date.now()}`,
    });
  }

  // Login failed
  res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});
