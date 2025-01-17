Here's a detailed documentation explaining the various routes and parameters for your Express.js application:

---

# **User Authentication API Documentation**

This API provides user authentication and profile management using Node.js, Express, and MongoDB.  

---

## **Routes Overview**

### **1. User Registration (Sign Up)**

- **Endpoint:** `POST /signup`
- **Description:** Registers a new user and generates a token.  
- **Middleware:**  
  - `upload.fields` – Handles file uploads for profile and ID images.  
  - `validateSignUp` – Validates the request body for required fields.  
- **Request Body (Form Data):**  
  - `fullName` (String, Required)  
  - `email` (String, Required, Unique)  
  - `password` (String, Required)  
  - `mobileNo` (Number, Required, Unique)  
  - `gender` (String, Required, Enum: ["Male", "Female"])  
  - `profileImageUrl` (File, Required)  
  - `idImageUrl` (File, Required)  

- **Success Response:**  
  - **Status:** `201 Created`  
  - **Body:**  
    ```json
    {
      "msg": "success",
      "token": "<JWT_TOKEN>"
    }
    ```
- **Error Response:**  
  - **Status:** `400 Bad Request`  
  - **Body:**  
    ```json
    {
      "errors": [{ "msg": "Error message" }]
    }
    ```

---

### **2. User Login (Sign In)**

- **Endpoint:** `POST /login`  
- **Description:** Logs in the user and generates a token.  
- **Middleware:**  
  - `validateSignIn` – Validates the request body for required fields.  
- **Request Body:**  
  - `email` (String, Required)  
  - `password` (String, Required)  

- **Success Response:**  
  - **Status:** `200 OK`  
  - **Body:**  
    ```json
    {
      "msg": "success",
      "token": "<JWT_TOKEN>"
    }
    ```
- **Error Response:**  
  - **Status:** `400 Bad Request`  
  - **Body:**  
    ```json
    {
      "err": "Email Not Found / Wrong Password"
    }
    ```

---

### **3. Get User Profile**

- **Endpoint:** `GET /my-profile`  
- **Description:** Fetches the authenticated user's profile.  
- **Middleware:**  
  - `authUser` – Protects the route by verifying the token.  
- **Headers:**  
  - `Authorization: Bearer <JWT_TOKEN>`  

- **Success Response:**  
  - **Status:** `200 OK`  
  - **Body:**  
    ```json
    {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "mobileNo": 1234567890,
      "gender": "Male",
      "docs": {
        "profileImageUrl": "/images/defaultUser.png",
        "idImageUrl": "/path/to/id/image"
      },
      "ridesBooked": [],
      "rating": 0
    }
    ```
- **Error Response:**  
  - **Status:** `401 Unauthorized`  
  - **Body:**  
    ```json
    {
      "error": "Unauthorized access"
    }
    ```

---

### **4. User Logout**

- **Endpoint:** `GET /logout`  
- **Description:** Logs out the user and invalidates the token by storing it in a blacklist.  
- **Middleware:**  
  - `authUser` – Protects the route by verifying the token.  
- **Headers:**  
  - `Authorization: Bearer <JWT_TOKEN>`  

- **Success Response:**  
  - **Status:** `200 OK`  
  - **Body:**  
    ```json
    {
      "msg": "success"
    }
    ```
- **Error Response:**  
  - **Status:** `401 Unauthorized`  
  - **Body:**  
    ```json
    {
      "error": "error during logout :: error message"
    }
    ```

---

## **Data Models (Mongoose Schema)**

### **User Schema:**
```javascript
const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Password is hidden by default
    mobileNo: { type: Number, required: true, unique: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    docs: {
      profileImageUrl: { type: String, default: "/images/defaultUser.png" },
      idImageUrl: { type: String }
    },
    socket_id: { type: String },
    ridesBooked: { type: [Schema.Types.ObjectId], ref: "ride" },
    rating: { type: Number, default: 0 },
    salt: { type: String }
}, { timestamps: true });
```

---
