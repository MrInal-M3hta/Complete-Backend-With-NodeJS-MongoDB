## 🚀 🔐 COMPLETE AUTH FLOW

### 🟢 1️⃣ LOGIN FLOW
```
User → sends email + password
        │
        ▼
Backend (login controller)
        │
        ├── Check user exists
        ├── Compare password (bcrypt)
        │
        ▼
Generate Tokens
   ├── Access Token (short life)
   └── Refresh Token (long life)
        │
        ▼
Store refreshToken in DB
        │
        ▼
Send tokens to client (cookies)
```

### 🟡 2️⃣ ACCESS PROTECTED ROUTE (Middleware)
```
Client → sends request with accessToken
        │
        ▼
verifyJWT middleware
        │
        ├── Extract token
        ├── jwt.verify()
        │
        ▼
Decoded user data (_id)
        │
        ▼
Find user in DB
        │
        ▼
Attach user to request
        │
        ▼
req.user = user
        │
        ▼
Controller runs (authorized ✅)
```
### 🔴 3️⃣ ACCESS TOKEN EXPIRED
```
Client request fails (401 Unauthorized)
        │
        ▼
Frontend detects expired token
        │
        ▼
Calls /refresh-token API
```
### 🔵 4️⃣ REFRESH TOKEN FLOW
```
Client → sends refreshToken (cookie/body)
        │
        ▼
Backend refresh controller
        │
        ├── jwt.verify(refreshToken)
        ├── Find user in DB
        ├── Match stored refreshToken
        │
        ▼
Generate NEW tokens
   ├── newAccessToken
   └── newRefreshToken
        │
        ▼
Update refreshToken in DB
        │
        ▼
Send new tokens to client ✅
```
### ⚫ 5️⃣ LOGOUT FLOW
```
Client → calls /logout
        │
        ▼
Backend logout controller
        │
        ├── Remove refreshToken from DB
        │
        ▼
Clear cookies
        │
        ▼
User logged out ❌
```
### 🔄 🔁 FULL FLOW (COMBINED)
```
LOGIN
  │
  ▼
Access Token + Refresh Token
  │
  ▼
Access Protected Route
  │
  ▼
Access Token expires ❌
  │
  ▼
Refresh Token API
  │
  ▼
New Tokens generated ✅
  │
  ▼
Continue using app
  │
  ▼
Logout → clear tokens ❌
```
#### 🧠 🔑 KEY CONCEPTS
| Concept | Meaning |
|---------| -------- |
| Acess Token | Short-lived auth token |
| Refresh token | Long-lived token|
| Middleware | Protect routes |
| Cookies | Stores token  securely |
| DB Token Match | Prevent token reuse |

#### 🔐 🔥 SECURITY LAYERS
```
1. Password hashing (bcrypt)
2. JWT verification
3. Refresh token stored in DB
4. httpOnly cookies
5. Token rotation
```

**🎯 REAL-WORLD UNDERSTANDING**
```
Login → get keys 🔑
Access Token → temporary key 🪪
Refresh Token → master key 🧾

Temporary key expires → use master key → get new key
Logout → destroy master key ❌
```