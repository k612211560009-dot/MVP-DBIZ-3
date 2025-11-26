# API Specifications Detailed

## 1. Authentication & Authorization API

### 1.1 User Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "donor@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "uuid",
      "email": "donor@example.com",
      "name": "Nguyen Van A",
      "role": "donor",
      "isActive": true
    }
  },
  "message": "Login successful"
}
```

### 1.2 Token Refresh

```http
POST /api/v1/auth/refresh
Content-Type: application/json
Authorization: Bearer {refreshToken}

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 2. Donor Management API

### 2.1 Donor Registration

```http
POST /api/v1/donors/register
Content-Type: application/json

{
  "personalInfo": {
    "name": "Nguyen Thi B",
    "email": "donor@example.com",
    "phone": "+84123456789",
    "dateOfBirth": "1990-05-15",
    "nationalId": "001234567890",
    "address": "123 Main Street, District 1, HCMC"
  },
  "screeningAnswers": {
    "hasChronicIllness": false,
    "hasInfectiousDisease": false,
    "hasSmokingHabit": false,
    "hasAlcoholConsumption": false,
    "hasMedicationUsage": false,
    "hasTattooRecent": false,
    "hasBloodTransfusion": false,
    "hasTravelAbroad": false
  },
  "healthInfo": {
    "bloodType": "A",
    "rhFactor": "positive",
    "pregnancyStatus": "postpartum",
    "babyAgeMonths": 3
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "donorId": "uuid",
    "registrationId": "DN20240120001",
    "nextStep": "schedule_interview",
    "estimatedTimeline": "2-3 business days",
    "requiredDocuments": ["national_id", "health_records"]
  },
  "message": "Registration submitted successfully"
}
```

### 2.2 Get Donor Profile

```http
GET /api/v1/donors/profile
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "donor": {
      "donorId": "uuid",
      "name": "Nguyen Thi B",
      "email": "donor@example.com",
      "phone": "+84123456789",
      "donorStatus": "in_progress",
      "screeningStatus": "pending",
      "pointsTotal": 0,
      "registrationDate": "2024-01-20T10:00:00Z"
    },
    "appointments": [
      {
        "appointmentId": "uuid",
        "type": "screening_interview",
        "scheduledStart": "2024-01-22T14:00:00Z",
        "status": "scheduled",
        "staffName": "Dr. Tran Van C"
      }
    ],
    "recentDonations": []
  }
}
```

## 3. Appointment Management API

### 3.1 Get Available Time Slots

```http
GET /api/v1/appointments/available-slots?date=2024-01-25&type=screening_interview&duration=30
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "date": "2024-01-25",
    "slots": [
      {
        "start": "2024-01-25T09:00:00+07:00",
        "end": "2024-01-25T09:30:00+07:00",
        "staffAvailable": [
          {
            "staffId": "uuid",
            "name": "Dr. Le Thi D",
            "specialty": "Pediatrics"
          }
        ],
        "slotType": "available"
      },
      {
        "start": "2024-01-25T09:30:00+07:00",
        "end": "2024-01-25T10:00:00+07:00",
        "staffAvailable": [],
        "slotType": "full"
      }
    ]
  }
}
```

### 3.2 Create Appointment

```http
POST /api/v1/appointments
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "type": "screening_interview",
  "scheduledStart": "2024-01-25T09:00:00+07:00",
  "scheduledEnd": "2024-01-25T09:30:00+07:00",
  "preferredStaffId": "uuid",
  "notes": "First time donor screening"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "appointmentId": "uuid",
    "confirmation": {
      "scheduledStart": "2024-01-25T09:00:00+07:00",
      "scheduledEnd": "2024-01-25T09:30:00+07:00",
      "staffAssigned": {
        "staffId": "uuid",
        "name": "Dr. Le Thi D",
        "email": "dr.le@hospital.org",
        "phone": "+84123456788"
      },
      "meetingDetails": {
        "location": "Room 201, Milk Bank Building",
        "meetingLink": "https://meet.google.com/abc-def-ghi",
        "instructions": "Please bring your national ID and health records"
      }
    },
    "googleCalendarEvent": {
      "eventId": "mock_event_123",
      "htmlLink": "https://calendar.google.com/event/mock"
    }
  },
  "message": "Appointment scheduled successfully"
}
```

## 4. Medical Staff API

### 4.1 Submit Screening Results

```http
POST /api/v1/medical/screening
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "appointmentId": "uuid",
  "donorId": "uuid",
  "screeningData": {
    "vitalSigns": {
      "bloodPressure": "120/80",
      "heartRate": 72,
      "temperature": 36.8
    },
    "medicalHistory": {
      "hasChronicDisease": false,
      "hasSurgeryHistory": false,
      "hasAllergies": false,
      "currentMedications": []
    },
    "lifestyleAssessment": {
      "dietQuality": "good",
      "sleepQuality": "good",
      "stressLevel": "moderate"
    },
    "breastHealth": {
      "milkProduction": "adequate",
      "anyPain": false,
      "anyInfection": false
    }
  },
  "screeningResult": "pass",
  "medicalNotes": "Donor appears healthy and suitable for milk donation",
  "recommendations": "Can start donation immediately"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "screeningId": "uuid",
    "nextSteps": "await_director_approval",
    "estimatedTimeline": "1-2 business days"
  },
  "message": "Screening results submitted successfully"
}
```

### 4.2 Record Milk Donation

```http
POST /api/v1/medical/donations
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "appointmentId": "uuid",
  "donorId": "uuid",
  "donationData": {
    "donationTime": "2024-01-25T10:15:00+07:00",
    "milkVolumeMl": 150.5,
    "containerCount": 2,
    "healthStatus": "good",
    "healthNotes": "Donor in good condition, no issues reported",
    "qualityAssessment": {
      "color": "creamy_white",
      "consistency": "normal",
      "odor": "normal",
      "temperature": 4.2
    }
  },
  "pointsAwarded": 150
}
```

## 5. Integration Mock APIs

### 5.1 EHR Test Results Mock

```http
POST /api/v1/mock/ehr/test-results
Content-Type: application/json

{
  "nationalId": "001234567890",
  "testTypes": ["hiv", "hepatitis_b", "hepatitis_c", "syphilis"]
}
```

**Mock Response:**

```json
{
  "success": true,
  "data": {
    "donorId": "001234567890",
    "tests": [
      {
        "type": "hiv",
        "result": "negative",
        "testDate": "2024-01-10",
        "resultDate": "2024-01-12",
        "validUntil": "2024-07-10",
        "labName": "Central Laboratory HCMC",
        "labId": "LAB-2024-001234",
        "methodology": "ELISA"
      },
      {
        "type": "hepatitis_b",
        "result": "negative",
        "testDate": "2024-01-10",
        "resultDate": "2024-01-12",
        "validUntil": "2024-07-10",
        "labName": "Central Laboratory HCMC",
        "labId": "LAB-2024-001235"
      }
    ],
    "overallStatus": "clear",
    "lastUpdated": "2024-01-20T14:30:00Z"
  },
  "isMock": true
}
```

> NOTE (MVP security): EHR endpoints are considered internal-only. In production, `/api/v1/mock/ehr/*` should be accessible only from internal gateway or test environments. Real EHR endpoints must be proxied by the internal backend service and protected by `networkCheck` and role-based guards.

### 5.3 Internal (HIS) Endpoints — INTERNAL ONLY

These endpoints are intentionally NOT exposed by the public gateway. They are served from the internal gateway and require the `networkCheck` middleware and role-based HIS guards.

```http
POST /internal-api/v1/his/fetch-test-results
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "nationalId": "001234567890"
}
```

Security:

- Requests to `/internal-api/*` must pass `networkCheck` (verify hospital IP range) and `hisAccessGuard` (verify user role and permissions).
- The frontend should never call these routes directly; only staff clients within the hospital network (or backend-to-backend) may call them.

### 5.2 Digital Signature Mock

```http
POST /api/v1/mock/signature/sign
Content-Type: application/json

{
  "documentType": "donation_consent",
  "documentContent": "Base64 encoded PDF content",
  "userCredentials": {
    "nationalId": "001234567890",
    "phone": "+84123456789"
  }
}
```

**Mock Response:**

```json
{
  "success": true,
  "data": {
    "signedDocument": "Base64 encoded signed PDF",
    "signatureId": "SIGN-2024-001234",
    "timestamp": "2024-01-20T15:45:30Z",
    "certificateInfo": {
      "issuer": "VNPT-CA",
      "validFrom": "2024-01-01",
      "validTo": "2025-01-01"
    }
  },
  "isMock": true
}
```

## 6. Admin & Reporting API

### 6.1 Get Donor Statistics

```http
GET /api/v1/admin/statistics?period=month&year=2024&month=1
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "2024-01",
    "registrations": {
      "total": 45,
      "approved": 32,
      "pending": 8,
      "rejected": 5
    },
    "donations": {
      "totalVolumeMl": 12500,
      "totalDonations": 28,
      "averagePerDonor": 446.4
    },
    "points": {
      "totalAwarded": 12500,
      "totalRedeemed": 4500,
      "activeBalance": 8000
    }
  }
}
```
