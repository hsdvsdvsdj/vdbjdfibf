# SkillSwap API Documentation

## Base URL
- **Development:** `http://localhost:8000`
- **Production:** `https://api.skillswap.com`

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request:**
```json
{
  "login": "string",
  "email": "user@example.com",
  "password": "string",
  "nickname": "string"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**Errors:**
- `400` - User with this login or email already exists

---

### 2. Login
**POST** `/auth/login`

**Request:**
```json
{
  "login": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**Cookies:** Refresh token set as HttpOnly cookie

**Errors:**
- `401` - Invalid login or password

---

### 3. Refresh Token
**POST** `/auth/refresh`

**Headers:**
```
Cookie: refresh_token=<refresh_token>
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

---

### 4. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

---

## User Endpoints

### 5. Get Current User
**GET** `/users/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 1,
  "login": "string",
  "nickname": "string",
  "email": "user@example.com",
  "photo": "url",
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### 6. Get User Profile by ID
**GET** `/users/{user_id}`

**Response (200):**
```json
{
  "id": 1,
  "login": "string",
  "nickname": "string",
  "photo": "url",
  "is_verified": false,
  "rating": 4.5,
  "skills_count": 3,
  "reviews_count": 10
}
```

---

### 7. Update User Profile
**PUT** `/users/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "nickname": "string",
  "photo": "url",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "id": 1,
  "login": "string",
  "nickname": "string",
  "email": "newemail@example.com",
  "photo": "url"
}
```

---

## Skills Endpoints

### 8. Create Skill
**POST** `/skills`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "title": "Python для начинающих",
  "description": "Основы программирования на Python",
  "category": "Programming",
  "price_per_hour": 500,
  "experience_level": "Beginner"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Python для начинающих",
  "description": "Основы программирования на Python",
  "category": "Programming",
  "price_per_hour": 500,
  "experience_level": "Beginner",
  "user_id": 1,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 9. Get All Skills (with filters)
**GET** `/skills?category=Programming&experience_level=Beginner&search=Python`

**Response (200):**
```json
{
  "total": 50,
  "items": [
    {
      "id": 1,
      "title": "Python для начинающих",
      "description": "Основы программирования на Python",
      "category": "Programming",
      "price_per_hour": 500,
      "experience_level": "Beginner",
      "user": {
        "id": 1,
        "nickname": "John",
        "photo": "url",
        "rating": 4.8
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 10. Get Skill by ID
**GET** `/skills/{skill_id}`

**Response (200):**
```json
{
  "id": 1,
  "title": "Python для начинающих",
  "description": "Основы программирования на Python",
  "category": "Programming",
  "price_per_hour": 500,
  "experience_level": "Beginner",
  "user": {
    "id": 1,
    "login": "john",
    "nickname": "John",
    "photo": "url",
    "rating": 4.8,
    "reviews_count": 10
  },
  "reviews": [
    {
      "id": 1,
      "author": "Jane",
      "rating": 5,
      "text": "Отличный учитель!",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 11. Update Skill
**PUT** `/skills/{skill_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "title": "Python для начинающих",
  "description": "Обновленное описание",
  "price_per_hour": 600
}
```

---

### 12. Delete Skill
**DELETE** `/skills/{skill_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Skill deleted successfully"
}
```

---

## Orders Endpoints

### 13. Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "skill_id": 1,
  "duration_hours": 2,
  "total_price": 1000,
  "description": "Нужна помощь с Python"
}
```

**Response (201):**
```json
{
  "id": 1,
  "skill_id": 1,
  "buyer_id": 2,
  "seller_id": 1,
  "status": "pending",
  "duration_hours": 2,
  "total_price": 1000,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### 14. Get User Orders
**GET** `/orders?status=pending&role=buyer`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "total": 10,
  "items": [
    {
      "id": 1,
      "skill": {
        "id": 1,
        "title": "Python для начинающих"
      },
      "buyer": {
        "id": 2,
        "nickname": "Jane"
      },
      "seller": {
        "id": 1,
        "nickname": "John"
      },
      "status": "pending",
      "duration_hours": 2,
      "total_price": 1000,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 15. Update Order Status
**PUT** `/orders/{order_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "status": "accepted"
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "accepted",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## Reviews Endpoints

### 16. Create Review
**POST** `/reviews`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "skill_id": 1,
  "order_id": 1,
  "rating": 5,
  "text": "Отличный учитель, очень помог мне разобраться в Python!"
}
```

**Response (201):**
```json
{
  "id": 1,
  "skill_id": 1,
  "order_id": 1,
  "author_id": 2,
  "author_name": "Jane",
  "rating": 5,
  "text": "Отличный учитель!",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 17. Get Skill Reviews
**GET** `/skills/{skill_id}/reviews`

**Response (200):**
```json
{
  "total": 5,
  "average_rating": 4.8,
  "items": [
    {
      "id": 1,
      "author_name": "Jane",
      "author_photo": "url",
      "rating": 5,
      "text": "Отличный учитель!",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Chat Endpoints

### 18. Get Chats for Order
**GET** `/chats/order/{order_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "order_id": 1,
    "timestamp": "2024-01-01T00:00:00Z",
    "sender_id": 1,
    "sender_name": "John",
    "message": "Когда мы можем начать занятие?"
  }
]
```

---

### 19. Send Message
**POST** `/chats/order/{order_id}/message`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "message": "Давайте завтра в 18:00"
}
```

**Response (201):**
```json
{
  "id": 1,
  "order_id": 1,
  "sender_id": 1,
  "message": "Давайте завтра в 18:00",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message here"
}
```

**Common Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Headers

All requests (except login/register) should include:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```
