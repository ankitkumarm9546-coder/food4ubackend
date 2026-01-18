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

### Login
- **POST** `/api/auth/login`
- **Payload:**
```json
{
  "phone": "1234567890",
  "password": "password123",
  "activeRole": "driver"
}
```

- **Response:**
```json
{
  "token": "jwt-token",
  "activeRole": "driver",
  "roles": ["driver"]
}
```

### Logout
- **POST** `/api/auth/logout`
- **Response:**
```json
{
  "success": true,
  "message": "Logged out"
}
```

### Foods

#### POST `/api/foods`
```json
{
  "name": "Rice",
  "imageUrl": "https://cdn.app.com/foods/rice.png",
  "category": "grain",
  "dietaryTags": ["vegan", "gluten-free"],
  "allergens": [],
  "serving": { "size": 100, "unit": "g" },
  "basePrepTime": 20,
  "prepMethods": [
    {
      "method": "boiled",
      "prepTimeMultiplier": 1.0,
      "nutritionRetention": 0.95
    }
  ],
  "nutrition": {
    "calories": 130,
    "protein": 2.7,
    "carbs": 28,
    "fat": 0.3,
    "fiber": 0.4
  },
  "glycemicIndex": 73
}
```

#### GET `/api/foods`
Query params: `category`, `dietary`, `search`

#### GET `/api/foods/:id`
Returns full food details.

#### PUT `/api/foods/:id`
Partial update payload supported.

#### DELETE `/api/foods/:id`
Soft deletes a food by setting `isActive=false`.

## Features

- User registration with multiple roles support
- Password hashing with bcrypt
- MongoDB integration
- Input validation
- Error handling

