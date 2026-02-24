# 🔐 Authentication API

A RESTful Authentication API built with **Node.js**, **Express.js**, and **MongoDB**. Supports user registration, login, logout, and account management using **JWT-based authentication** with HTTP-only cookies.

---

## 🛠 Tech Stack

- **Node.js** + **Express.js v5**
- **MongoDB** + **Mongoose**
- **JWT** (Access & Refresh Tokens)
- **bcrypt** (password hashing)
- **Multer** (file uploads)

---

## ⚙️ Setup

1. **Clone & install dependencies:**

   ```bash
   git clone https://github.com/your-username/Authentication-API.git
   cd Authentication-API/backend
   npm install
   ```

2. **Create a `.env` file in `backend/`:**

   ```env
   PORT=3003
   MONGODB_URI=your_mongodb_uri
   ACCESSTOKEN_SECRET=your_access_token_secret
   ACCESSTOKEN_EXPIRY=1d
   REFRESHTOKEN_SECRET=your_refresh_token_secret
   REFRESHTOKEN_EXPIRY=10d
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   # Server running at http://localhost:3003
   ```

---

## 📡 API Endpoints

Base URL: `http://localhost:3003`

| Method   | Endpoint           | Auth | Description               |
| -------- | ------------------ | ---- | ------------------------- |
| `GET`    | `/`                | ❌   | Health check              |
| `POST`   | `/users/signup`    | ❌   | Register a new user       |
| `POST`   | `/users/login`     | ❌   | Login (username or email) |
| `POST`   | `/users/logout`    | ✅   | Logout current user       |
| `GET`    | `/users/:username` | ❌   | Get a user's profile      |
| `PATCH`  | `/users/:username` | ✅   | Update profile details    |
| `DELETE` | `/users/:username` | ✅   | Delete own account        |

> **Auth:** Pass the JWT via cookie (`accessToken`) or header: `Authorization: Bearer <token>`

> **`/signup` and `PATCH`** require `form-data` (for profile photo upload via Multer).

---

## 📁 Project Structure

```
backend/src/
├── controllers/    # Route handlers
├── db/             # MongoDB connection
├── middlewares/    # JWT auth & Multer
├── models/         # Mongoose User schema
├── routes/         # Express routers
└── utils/          # ApiError, ApiResponse, AsyncHandler
```

---

## 📄 License

ISC
