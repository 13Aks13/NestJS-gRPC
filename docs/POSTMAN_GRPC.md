# gRPC in Postman

## Login

- **URL:** `localhost:5010` (no `http://`, no path).
- **Method:** `auth.AuthService` → **Login**.
- **Message (body):**
  ```json
  { "email": "user1@example.com", "password": "password123" }
  ```

**Response:**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "user": {
    "id": "<uuid>",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Proto (required)

Import **`src/auth.proto`** in Postman: **Service definition** → **Import .proto file** → select `src/auth.proto`.

`AuthResponse` must have **all three fields** (or you get "invalid wire type 7"):

- `access_token` = 1  
- `refresh_token` = 2  
- `user` = 3  

Re-import the proto after any server changes so Postman’s definition matches the server.
