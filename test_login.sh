#!/bin/bash

echo "==================================="
echo "Testing Milk Bank System Health & Login"
echo "==================================="
echo ""

# Backend URL
BACKEND_URL="http://localhost:5000"

# Test 1: Backend Health Check
echo "1. Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" $BACKEND_URL/api/health)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)

if [ "$HEALTH_CODE" == "200" ]; then
    echo "✅ Backend Health: OK"
    echo "   Response: $HEALTH_BODY"
else
    echo "❌ Backend Health: FAILED (HTTP $HEALTH_CODE)"
    echo "   Response: $HEALTH_BODY"
fi
echo ""

# Test 2: Staff Login
echo "2. Testing Staff Login..."
STAFF_LOGIN=$(curl -s -X POST $BACKEND_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff001@milkbank.com",
    "password": "Staff123!@#"
  }')

echo "$STAFF_LOGIN" | grep -q '"success":true'
if [ $? -eq 0 ]; then
    echo "✅ Staff Login: SUCCESS"
    echo "   Email: staff001@milkbank.com"
    STAFF_TOKEN=$(echo "$STAFF_LOGIN" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    echo "   Token: ${STAFF_TOKEN:0:50}..."
else
    echo "❌ Staff Login: FAILED"
    echo "   Response: $STAFF_LOGIN"
fi
echo ""

# Test 3: Donor Login (Need to check if donor exists)
echo "3. Testing Donor Login..."
DONOR_LOGIN=$(curl -s -X POST $BACKEND_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor001@example.com",
    "password": "Donor123!@#"
  }')

echo "$DONOR_LOGIN" | grep -q '"success":true'
if [ $? -eq 0 ]; then
    echo "✅ Donor Login: SUCCESS"
    echo "   Email: donor001@example.com"
    DONOR_TOKEN=$(echo "$DONOR_LOGIN" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    echo "   Token: ${DONOR_TOKEN:0:50}..."
else
    echo "⚠️  Donor Login: User not found or wrong credentials"
    echo "   Response: $DONOR_LOGIN"
    echo "   Note: You may need to create a donor account first"
fi
echo ""

# Test 4: Staff Profile Access
if [ ! -z "$STAFF_TOKEN" ]; then
    echo "4. Testing Staff Profile Access..."
    STAFF_PROFILE=$(curl -s -X GET $BACKEND_URL/api/auth/profile \
      -H "Authorization: Bearer $STAFF_TOKEN")
    
    echo "$STAFF_PROFILE" | grep -q '"role":"staff"'
    if [ $? -eq 0 ]; then
        echo "✅ Staff Profile Access: SUCCESS"
        echo "   Response: $STAFF_PROFILE"
    else
        echo "❌ Staff Profile Access: FAILED"
        echo "   Response: $STAFF_PROFILE"
    fi
else
    echo "4. Testing Staff Profile Access... SKIPPED (No token)"
fi
echo ""

# Test 5: Donor Profile Access
if [ ! -z "$DONOR_TOKEN" ]; then
    echo "5. Testing Donor Profile Access..."
    DONOR_PROFILE=$(curl -s -X GET $BACKEND_URL/api/auth/profile \
      -H "Authorization: Bearer $DONOR_TOKEN")
    
    echo "$DONOR_PROFILE" | grep -q '"role":"donor"'
    if [ $? -eq 0 ]; then
        echo "✅ Donor Profile Access: SUCCESS"
        echo "   Response: $DONOR_PROFILE"
    else
        echo "❌ Donor Profile Access: FAILED"
        echo "   Response: $DONOR_PROFILE"
    fi
else
    echo "5. Testing Donor Profile Access... SKIPPED (No token)"
fi
echo ""

echo "==================================="
echo "Test Complete!"
echo "==================================="
