# MERN Authentication System (Login & Signup)

A full-stack authentication system built with **MongoDB, Express, React, and Node.js**. Users can create an account, sign in, stay signed in across page refreshes, and access pages that are only available to signed-in users.

Passwords are hashed with bcrypt, and sessions use JSON Web Tokens (JWT) stored in **httpOnly cookies**, which page scripts cannot read. This keeps tokens out of reach of cross-site scripting (XSS) attacks.

---

## Features

- User signup with name, email, and password
- User login and logout
- Passwords hashed with bcrypt (12 salt rounds)
- JWT sessions stored in httpOnly cookies
- Persistent login: the session survives a page refresh
- Protected routes on both the backend (middleware) and frontend (route guards)
- Signed-in users are redirected away from the login and signup pages
- Form validation in the browser and on the server
- Clear error messages, such as duplicate email or wrong password
- Show/hide password toggle
- Responsive layout that works on mobile
- Accessible forms with labels, error announcements, and visible keyboard focus

---

## Tech Stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | React 18, Vite, React Router v6, Axios       |
| Backend  | Node.js, Express 4                           |
| Database | MongoDB with Mongoose                        |
| Auth     | JSON Web Tokens (jsonwebtoken), bcryptjs     |
| Other    | cookie-parser, cors, dotenv                  |

---

## Project Structure

```
mern-auth/
├── server/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── authController.js      # signup, login, logout, getMe
│   ├── middleware/
│   │   └── authMiddleware.js      # protect(): verifies JWT cookie
│   ├── models/
│   │   └── User.js                # User schema + password hashing
│   ├── routes/
│   │   └── authRoutes.js          # /api/auth routes
│   ├── .env.example               # Environment variable template
│   ├── package.json
│   └── server.js                  # App entry point
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx     # Shared layout for auth pages
│   │   │   ├── Field.jsx          # Reusable input with errors
│   │   │   └── ProtectedRoute.jsx # ProtectedRoute + GuestRoute
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx      # Protected page
│   │   ├── api.js                 # Axios instance
│   │   ├── App.jsx                # Routes
│   │   ├── index.css              # Styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # Dev proxy to the API
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) version 18 or newer
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- npm (included with Node.js)

---

## Getting Started

### 1. Get the code

Clone the repository or unzip the project, then open the folder:

```bash
git clone <your-repo-url> mern-auth
cd mern-auth
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in your values. The variables are described in the next section.

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the server:

```bash
npm run dev
```

The API runs at **http://localhost:5000**. You should see:

```
MongoDB connected: 127.0.0.1
Server running on port 5000
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The app runs at **http://localhost:5173**.

### 4. Try it out

1. Open http://localhost:5173. You will be redirected to the login page.
2. Click **Create an account** and sign up.
3. You'll land on the dashboard.
4. Refresh the page. You are still signed in.
5. Click **Sign out**, then sign back in.

---

## Environment Variables

All variables go in `server/.env`.

| Variable         | Description                                      | Example                                 |
|------------------|--------------------------------------------------|-----------------------------------------|
| `PORT`           | Port the API listens on                          | `5000`                                  |
| `MONGO_URI`      | MongoDB connection string                        | `mongodb://127.0.0.1:27017/mern-auth`   |
| `JWT_SECRET`     | Secret key for signing tokens (keep it private)  | a long random string                    |
| `JWT_EXPIRES_IN` | Default session length: `5m`, `30m`, `4h`, `8h`  | `30m`                                   |
| `CLIENT_URL`     | Frontend URL, used for CORS                      | `http://localhost:5173`                 |
| `NODE_ENV`       | `development` or `production`                    | `development`                           |

For the client in production, set this in `client/.env`:

| Variable       | Description              | Example                        |
|----------------|--------------------------|--------------------------------|
| `VITE_API_URL` | Full URL of the API      | `https://api.example.com/api`  |

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## API Reference

Base URL: `http://localhost:5000/api/auth`

### Sign up

`POST /signup`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "supersecret123"
}
```

**201 Created**: sets the `token` cookie and returns:

```json
{
  "user": { "id": "66a1...", "name": "Jane Doe", "email": "jane@example.com" }
}
```

Errors: `400` missing or invalid fields, `409` email already registered.

### Log in

`POST /login`

```json
{
  "email": "jane@example.com",
  "password": "supersecret123"
}
```

**200 OK**: sets the `token` cookie and returns the user.

Errors: `400` missing fields, `401` email or password is incorrect.

### Log out

`POST /logout`

**200 OK**: clears the cookie.

```json
{ "message": "Signed out" }
```

### Get current user (protected)

`GET /me`

Requires the `token` cookie.

**200 OK**

```json
{
  "user": {
    "id": "66a1...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-09-23T10:00:00.000Z"
  }
}
```

Errors: `401` not signed in or session expired.

### Testing with curl

```bash
# Sign up and save the cookie
curl -i -c cookies.txt -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"supersecret123"}' \
  http://localhost:5000/api/auth/signup

# Use the saved cookie on a protected route
curl -b cookies.txt http://localhost:5000/api/auth/me
```

---

## How Authentication Works

```
 ┌──────────┐   1. POST /login (email, password)    ┌──────────┐
 │  React   │ ────────────────────────────────────▶ │ Express  │
 │  client  │                                       │   API    │
 │          │   2. Set-Cookie: token=<JWT>          │          │
 │          │ ◀──────────────────────────────────── │          │
 │          │      (httpOnly, 7 days)               │          │
 │          │                                       │          │
 │          │   3. GET /me  (cookie sent auto)      │          │
 │          │ ────────────────────────────────────▶ │ protect()│
 │          │   4. { user }                         │ verifies │
 │          │ ◀──────────────────────────────────── │   JWT    │
 └──────────┘                                       └──────────┘
```

1. **Signup/Login.** The server validates the credentials. On signup, a Mongoose `pre("save")` hook hashes the password with bcrypt before storing it.
2. **Token issued.** The server signs a JWT containing the user's ID and sends it in an httpOnly cookie.
3. **Automatic sending.** The browser attaches the cookie to every request. Axios is configured with `withCredentials: true` so this also works cross-origin.
4. **Verification.** The `protect` middleware verifies the JWT, loads the user, and attaches it to `req.user`.
5. **Persistent sessions.** When the React app loads, `AuthContext` calls `/api/auth/me` to restore the session.
6. **Logout.** The server clears the cookie.

---

## Protecting Your Own Routes

### Backend

Add the `protect` middleware to any route:

```js
import { protect } from "../middleware/authMiddleware.js";

router.get("/api/notes", protect, async (req, res) => {
  const notes = await Note.find({ owner: req.user._id });
  res.json(notes);
});
```

### Frontend

Wrap any page in `ProtectedRoute` inside `App.jsx`:

```jsx
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
```

Access the user anywhere with the `useAuth` hook:

```jsx
import { useAuth } from "../context/AuthContext";

const { user, logout } = useAuth();
```

---

## Security Measures

| Measure                           | Protects against                                |
|-----------------------------------|-------------------------------------------------|
| bcrypt hashing (12 rounds)        | Leaked passwords if the database is breached    |
| httpOnly cookies                  | Token theft through XSS                         |
| `SameSite` cookie attribute       | Cross-site request forgery (CSRF)               |
| `Secure` cookies in production    | Token interception over plain HTTP              |
| `select: false` on password field | Accidentally sending hashes in API responses    |
| Generic login error message       | Discovering which emails are registered         |
| CORS restricted to `CLIENT_URL`   | Other websites calling your API with cookies    |

---

## Deployment

The frontend and backend can be deployed separately, for example the client on Vercel or Netlify and the server on Render or Railway, with MongoDB Atlas as the database.

**Backend settings**

```
NODE_ENV=production
MONGO_URI=<your Atlas connection string>
JWT_SECRET=<long random string>
CLIENT_URL=https://your-frontend.com
```

**Frontend settings** (set before building)

```
VITE_API_URL=https://your-backend.com/api
```

Then build the client:

```bash
cd client
npm run build
```

**Important:**
- Both frontend and backend **must use HTTPS**. In production the cookie is set with `Secure` and `SameSite=None`, which browsers only accept over HTTPS.
- `CLIENT_URL` must exactly match the frontend's URL, with no trailing slash.
- If your host uses a proxy (Render, Heroku, and others), add `app.set("trust proxy", 1);` in `server.js` so secure cookies work.
- For single-page app routing, configure your frontend host to serve `index.html` for all routes. On Netlify, add a `_redirects` file containing `/* /index.html 200`.

---

## Troubleshooting

| Problem                                        | Fix                                                                                      |
|------------------------------------------------|------------------------------------------------------------------------------------------|
| `MongoDB connection failed`                    | Make sure MongoDB is running, or check your Atlas URI and IP allowlist.                  |
| `JWT_SECRET is missing`                        | Create `server/.env` from `.env.example` and set `JWT_SECRET`.                           |
| Signed out after every refresh                 | Confirm Axios has `withCredentials: true` and the cookie appears in DevTools → Application → Cookies. |
| CORS errors in production                      | Check that `CLIENT_URL` matches your frontend URL exactly.                               |
| Cookie not set in production                   | Use HTTPS on both sides and add `app.set("trust proxy", 1)` behind a proxy.              |
| `Network Error` in the browser                 | Make sure the server is running on port 5000.                                            |

---

## Scripts

**Server** (`/server`)

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start with auto-restart on changes   |
| `npm start`     | Start in production mode             |

**Client** (`/client`)

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start the development server   |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview the production build   |

---

## Possible Improvements

- Password reset by email
- Email verification on signup
- Rate limiting on login and signup (for example with `express-rate-limit`)
- Refresh tokens with short-lived access tokens
- OAuth sign-in (Google, GitHub)
- Role-based access control (admin and user)
- Security headers with `helmet`
- Automated tests with Jest and Supertest

---

## License

MIT. Free to use and modify.
