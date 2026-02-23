# gRPC in Postman

## Login

- **URL:** `localhost:5010` (no `http://`, no path).
- **Method:** `auth.AuthService` → **Login**.
- **Message (body):**
  ```json
  { "email": "user1@example.com", "password": "password123" }
  ```

**Response:** `access_token` (JWT) and `user` (id, email, name).  
Refresh tokens are only returned by the **HTTP** API (`POST /auth/login`), not by gRPC.

## Proto

Import **`src/auth.proto`** in Postman (Service definition → Import .proto file).  
`AuthResponse` has two fields: `access_token` (1), `user` (2).
