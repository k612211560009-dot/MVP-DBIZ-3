# Backend Architecture Plan

## 1. Project Structure (MVP-focused)

```
backend/
├── src/
│   ├── controllers/          # Route handlers
│   │   ├── authController.js
│   │   ├── donorController.js
│   │   ├── appointmentController.js
│   │   ├── medicalController.js
│   │   └── adminController.js
│   ├── models/              # Sequelize models
│   │   ├── User.js
│   │   ├── Donor.js
│   │   ├── Appointment.js
│   │   └── index.js
│   ├── services/            # Business logic (split for security)
│   │   ├── public/          # Donor-facing services (public API gateway)
│   │   │   ├── authService.js
│   │   │   ├── donorService.js
│   │   │   └── appointmentService.js
│   │   └── internal/        # Staff-only services (internal gateway, hospital network)
│   │       ├── hisIntegrationService.js
│   │       ├── staffManagementService.js
│   │       └── medicalWorkflowService.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── networkCheck.js    # Verify requests from hospital/internal network for HIS
│   │   ├── hisAccessGuard.js   # Restrict access to HIS endpoints
│   │   ├── errorHandler.js
│   │   └── rateLimit.js
│   ├── utils/               # Utilities
│   │   ├── logger.js
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── config/              # Configuration
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── environment.js
│   ├── routes/              # API routes
│   │   ├── public/          # routes mounted on public gateway
│   │   │   ├── auth.js
│   │   │   ├── donors.js
│   │   │   └── appointments.js
│   │   └── internal/        # routes mounted on internal gateway (hospital network)
│   │       ├── his.js
│   │       └── staff.js
│   └── app.js              # Express app setup (mount gateways & routers)
├── tests/                  # Test suites
├── scripts/               # Database scripts
├── docs/                  # API documentation
└── package.json
```

Notes:

- This file focuses on MVP features only. Non-MVP/optional services are omitted to keep the initial scope small.
- The `public/` vs `internal/` split enforces that HIS integrations and any hospital-confidential APIs live behind the internal gateway and are only reachable from the hospital network (via VPN) and with mTLS.

## 1.1 Internal Services & HIS Security (MVP)

Below are short example snippets intended for documentation and early scaffolding. They are minimal, safe examples — do not copy secrets into code; use a secure vault for certs/keys.

### middleware/networkCheck.js (example)

```javascript
// middleware/networkCheck.js
const ip = require("ip");
const ipRangeCheck = require("ip-range-check");

const HOSPITAL_RANGES = process.env.HOSPITAL_IP_RANGES
  ? process.env.HOSPITAL_IP_RANGES.split(",")
  : ["192.168.1.0/24", "10.0.1.0/24"];

module.exports = function networkCheck(req, res, next) {
  const clientIP = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    ""
  )
    .split(",")[0]
    .trim();

  // allow localhost for development when explicitly enabled
  if (
    process.env.ALLOW_LOCAL_DEV === "true" &&
    (clientIP === "127.0.0.1" || clientIP === "::1")
  ) {
    return next();
  }

  const isInternal = ipRangeCheck(clientIP, HOSPITAL_RANGES);

  if (!isInternal) {
    return res.status(403).json({
      success: false,
      error: {
        code: "HIS_ACCESS_RESTRICTED",
        message: "HIS features only available from hospital network",
      },
    });
  }

  next();
};
```

### middleware/hisAccessGuard.js (example)

```javascript
// middleware/hisAccessGuard.js
module.exports = function hisAccessGuard(req, res, next) {
  const user = req.user;

  // Only staff/director roles are allowed to access HIS endpoints
  if (!user || !["medical_staff", "director"].includes(user.role)) {
    return res
      .status(403)
      .json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Role not permitted for HIS access",
        },
      });
  }

  // Additional permission checks could go here
  next();
};
```

### services/internal/hisIntegrationService.js (MVP scaffold)

```javascript
// services/internal/hisIntegrationService.js
const axios = require("axios");
const fs = require("fs");

class HISIntegrationService {
  constructor(config = {}) {
    this.baseUrl = process.env.HIS_INTERNAL_URL || config.baseUrl;
    // In production, client cert/key should come from a secure vault, not env
    this.clientCert = process.env.HIS_CLIENT_CERT_PATH; // path to cert file
    this.clientKey = process.env.HIS_CLIENT_KEY_PATH; // path to key file
    this.caCert = process.env.HIS_CA_CERT_PATH; // path to ca
  }

  async mTLSRequest(opts) {
    const httpsAgent = new (require("https").Agent)({
      cert: fs.readFileSync(this.clientCert),
      key: fs.readFileSync(this.clientKey),
      ca: fs.readFileSync(this.caCert),
      rejectUnauthorized: true,
    });

    const response = await axios.request({
      ...opts,
      baseURL: this.baseUrl,
      httpsAgent,
      timeout: 10000,
    });

    return response.data;
  }

  // Example method allowed only from internal network
  async fetchStaffShifts(staffId, dateRange) {
    return this.mTLSRequest({
      method: "POST",
      url: "/shifts",
      data: { staffId, dateRange },
    });
  }
}

module.exports = new HISIntegrationService();
```

These scaffolds are intentionally small and MVP-targeted. For production you must:

- Pull certs/keys from a secrets manager (Key Vault/HashiCorp Vault), not env vars or repo.
- Limit network egress with firewall/VPN and use mutual TLS.
- Add monitoring and strict error handling around external calls.

## 2. Core Service Implementation

### 2.1 Authentication Service

```javascript
// services/authService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

class AuthService {
  async login(email, password) {
    const user = await User.findOne({
      where: { email, isActive: true },
      include: ["donor"],
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.userId,
        tokenId: require("crypto").randomUUID(),
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  sanitizeUser(user) {
    const { passwordHash, ...sanitizedUser } = user.toJSON();
    return sanitizedUser;
  }
}

module.exports = new AuthService();
```

### 2.2 Appointment Scheduling Service

```javascript
// services/appointmentService.js
const { Appointment, User, Donor } = require("../models");
const CalendarService = require("./integration/calendarService");

class AppointmentService {
  async getAvailableSlots(date, type, duration = 30) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    // Get existing appointments for the day
    const existingAppointments = await Appointment.findAll({
      where: {
        scheduledStart: {
          [Op.between]: [startDate, endDate],
        },
        status: ["scheduled", "confirmed"],
      },
      include: [
        {
          model: User,
          as: "medicalStaff",
          where: { role: "medical_staff", isActive: true },
        },
      ],
    });

    // Get available medical staff
    const availableStaff = await User.findAll({
      where: {
        role: "medical_staff",
        isActive: true,
      },
    });

    // Generate time slots (mock implementation)
    const slots = this.generateTimeSlots(
      startDate,
      availableStaff,
      existingAppointments,
      duration
    );

    return slots;
  }

  async createAppointment(appointmentData) {
    const transaction = await sequelize.transaction();

    try {
      // Validate donor exists and is eligible
      const donor = await Donor.findByPk(appointmentData.donorId, {
        include: ["user"],
      });

      if (!donor || donor.donorStatus !== "in_progress") {
        throw new Error("Donor not eligible for appointments");
      }

      // Assign medical staff (load balancing logic)
      const assignedStaff = await this.assignMedicalStaff(
        appointmentData.scheduledStart,
        appointmentData.type
      );

      // Create appointment
      const appointment = await Appointment.create(
        {
          ...appointmentData,
          medicalStaffId: assignedStaff.userId,
          status: "scheduled",
        },
        { transaction }
      );

      // Create calendar event (mock)
      const calendarEvent = await CalendarService.createEvent({
        title: `Milk Donation - ${donor.user.name}`,
        start: appointmentData.scheduledStart,
        end: appointmentData.scheduledEnd,
        attendees: [
          { email: donor.user.email, name: donor.user.name },
          { email: assignedStaff.email, name: assignedStaff.name },
        ],
      });

      // Update appointment with calendar info
      await appointment.update(
        {
          googleCalendarEventId: calendarEvent.eventId,
          meetingLink: calendarEvent.hangoutLink,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        appointment,
        calendarEvent,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  generateTimeSlots(startDate, availableStaff, existingAppointments, duration) {
    // Implementation of slot generation logic
    const slots = [];
    const startTime = new Date(startDate);
    startTime.setHours(9, 0, 0, 0); // 9:00 AM

    const endTime = new Date(startDate);
    endTime.setHours(17, 0, 0, 0); // 5:00 PM

    for (
      let time = startTime;
      time < endTime;
      time.setMinutes(time.getMinutes() + 15)
    ) {
      const slotEnd = new Date(time);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      const staffAvailable = availableStaff.filter((staff) =>
        this.isStaffAvailable(staff, time, slotEnd, existingAppointments)
      );

      slots.push({
        start: new Date(time),
        end: new Date(slotEnd),
        staffAvailable,
        slotType: staffAvailable.length > 0 ? "available" : "full",
      });
    }

    return slots;
  }
}

module.exports = new AppointmentService();
```

## 3. Integration Services Architecture

### 3.1 Integration Service Factory

```javascript
// services/integration/integrationFactory.js
class IntegrationFactory {
  static createService(serviceType, config) {
    switch (serviceType) {
      case "ehr":
        return new EHRService(config);
      case "calendar":
        return new CalendarService(config);
      case "signature":
        return new SignatureService(config);
      case "notification":
        return new NotificationService(config);
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }
  }
}

// Base integration service
class BaseIntegrationService {
  constructor(serviceType, config) {
    this.serviceType = serviceType;
    this.config = config;
    this.isMock = config.useMock !== false;
    this.logger = require("../../utils/logger");
  }

  async execute(method, params) {
    const startTime = Date.now();

    try {
      let result;
      if (this.isMock) {
        result = await this.mockExecute(method, params);
      } else {
        result = await this.liveExecute(method, params);
      }

      this.logger.info("Integration service executed", {
        service: this.serviceType,
        method,
        duration: Date.now() - startTime,
        success: true,
      });

      return result;
    } catch (error) {
      this.logger.error("Integration service failed", {
        service: this.serviceType,
        method,
        error: error.message,
        duration: Date.now() - startTime,
      });

      // Fallback to mock if live service fails
      if (!this.isMock) {
        this.logger.warn("Falling back to mock service", {
          service: this.serviceType,
        });
        return await this.mockExecute(method, params);
      }

      throw error;
    }
  }

  mockExecute(method, params) {
    throw new Error("Mock execution not implemented");
  }

  async liveExecute(method, params) {
    throw new Error("Live execution not implemented");
  }
}
```

### 3.2 EHR Service Implementation

```javascript
// services/integration/ehrService.js
const BaseIntegrationService = require("./baseIntegrationService");

class EHRService extends BaseIntegrationService {
  constructor(config) {
    super("ehr", config);
  }

  async fetchTestResults(
    nationalId,
    testTypes = ["hiv", "hepatitis_b", "hepatitis_c", "syphilis"]
  ) {
    return this.execute("fetchTestResults", { nationalId, testTypes });
  }

  async mockExecute(method, params) {
    switch (method) {
      case "fetchTestResults":
        return this.mockFetchTestResults(params.nationalId, params.testTypes);
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  async liveExecute(method, params) {
    // Implementation for real EHR integration
    // This would make actual API calls to EHR system
    switch (method) {
      case "fetchTestResults":
        // Real implementation would go here
        const response = await fetch(
          `${this.config.baseUrl}/api/test-results`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nationalId: params.nationalId,
              testTypes: params.testTypes,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`EHR service returned ${response.status}`);
        }

        return await response.json();

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  mockFetchTestResults(nationalId, testTypes) {
    // Generate realistic mock test results
    const tests = testTypes.map((testType) => ({
      type: testType,
      result: "negative",
      testDate: this.randomPastDate(30), // Within last 30 days
      resultDate: this.randomPastDate(28), // Within last 28 days
      validUntil: this.randomFutureDate(180), // 6 months from now
      labName: "Central Laboratory HCMC",
      labId: `LAB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      methodology: "ELISA",
    }));

    return {
      donorId: nationalId,
      tests,
      overallStatus: "clear",
      lastUpdated: new Date().toISOString(),
    };
  }

  randomPastDate(maxDaysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysAgo));
    return date.toISOString().split("T")[0];
  }

  randomFutureDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  }
}

module.exports = EHRService;
```
