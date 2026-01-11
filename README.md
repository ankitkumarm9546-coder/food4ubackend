# Food4U Backend API

Node.js and MongoDB backend API for Food4U application.

## Installation

1. Install dependencies:
```bash
npm install
```

2. The MongoDB connection string is already configured in `.env` file.

## Running the Server

- Development mode (with nodemon):
```bash
npm run dev
```

- Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Register User
- **POST** `/api/auth/register`
- **Payload:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "password": "password123",
  "roles": ["driver", "restaurant"],
  "activeRole": "driver",
  "extraData": {
    "vehicle": "Toyota Camry"
  }
}
```

For restaurant role:
```json
{
  "name": "Restaurant Owner",
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

- **Response:**
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

## Features

- User registration with multiple roles support
- Password hashing with bcrypt
- MongoDB integration
- Input validation
- Error handling

