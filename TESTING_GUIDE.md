# API Testing Guide

## Prerequisites
1. Make sure the server is running: `npm start` or `npm run dev`
2. Ensure MongoDB connection is working

## Method 1: Using the Test Script (Easiest)

Run the automated test script:
```bash
node test-api.js
```

This will test:
- Health check endpoint
- Driver registration
- Restaurant registration
- Multiple roles registration
- Invalid request handling

## Method 2: Using cURL (Command Line)

### Test 1: Health Check
```bash
curl http://localhost:3000/
```

### Test 2: Register a Driver
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Driver\",\"phone\":\"1234567890\",\"password\":\"password123\",\"roles\":[\"driver\"],\"activeRole\":\"driver\",\"extraData\":{\"vehicle\":\"Toyota Camry\"}}"
```

### Test 3: Register a Restaurant
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Pizza Palace Owner\",\"phone\":\"9876543210\",\"password\":\"password123\",\"roles\":[\"restaurant\"],\"activeRole\":\"restaurant\",\"extraData\":{\"restaurantName\":\"Pizza Palace\",\"lat\":40.7128,\"lng\":-74.0060}}"
```

### Test 4: Register with Multiple Roles
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Multi Role User\",\"phone\":\"5555555555\",\"password\":\"password123\",\"roles\":[\"driver\",\"restaurant\"],\"activeRole\":\"driver\",\"extraData\":{\"vehicle\":\"Honda Civic\",\"restaurantName\":\"Burger King\",\"lat\":40.7580,\"lng\":-73.9855}}"
```

## Method 3: Using Postman

1. **Open Postman** and create a new request

2. **Health Check:**
   - Method: `GET`
   - URL: `http://localhost:3000/`

3. **Register Driver:**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "name": "John Driver",
     "phone": "1234567890",
     "password": "password123",
     "roles": ["driver"],
     "activeRole": "driver",
     "extraData": {
       "vehicle": "Toyota Camry"
     }
   }
   ```

4. **Register Restaurant:**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "name": "Pizza Palace Owner",
     "phone": "9876543210",
     "password": "password123",
     "roles": ["restaurant"],
     "activeRole": "restaurant",
     "extraData": {
       "restaurantName": "Pizza Palace",
       "lat": 40.7128,
       "lng": -74.0060
     }
   }
   ```

## Method 4: Using PowerShell (Windows)

### Register Driver:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -ContentType "application/json" -Body '{"name":"John Driver","phone":"1234567890","password":"password123","roles":["driver"],"activeRole":"driver","extraData":{"vehicle":"Toyota Camry"}}'
```

### Register Restaurant:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -ContentType "application/json" -Body '{"name":"Pizza Palace Owner","phone":"9876543210","password":"password123","roles":["restaurant"],"activeRole":"restaurant","extraData":{"restaurantName":"Pizza Palace","lat":40.7128,"lng":-74.0060}}'
```

## Expected Responses

### Success Response:
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

### Error Response (Missing Fields):
```json
{
  "success": false,
  "message": "Missing required fields: name, phone, password, roles (array), and activeRole are required"
}
```

### Error Response (Duplicate Phone):
```json
{
  "success": false,
  "message": "User with this phone number already exists"
}
```

## Testing Different Scenarios

1. **Valid Driver Registration** - Should return success with userId
2. **Valid Restaurant Registration** - Should return success with userId
3. **Multiple Roles** - Should accept both driver and restaurant extraData
4. **Missing Required Fields** - Should return 400 error
5. **Duplicate Phone Number** - Should return 400 error
6. **Invalid activeRole** - Should return 400 if activeRole not in roles array
7. **Missing extraData for driver** - Should return 400 error
8. **Missing extraData for restaurant** - Should return 400 error

