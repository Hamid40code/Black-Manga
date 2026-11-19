# Temple Sign-In & Account Setup

A responsive account creation and sign-in frontend built with React, Vite, TypeScript, and Tailwind CSS v4. The supplied temple image is used as the full-page background.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A backend implementing the API contract below

## Run locally

```bash
npm install
cp .env.example .env.local
```

Set `VITE_AUTH_API_BASE_URL` in `.env.local` to the real backend API root, then run:

```bash
npm run dev
```

Example shape: `http://localhost:3000/api`. Do not use that address unless your backend is actually listening there. Restart Vite after changing the environment file.

## Production build

```bash
npm run build
```

## Project structure

```text
src/
├── assets/Temple.jpg
├── components/auth/
│   ├── AccountSetupFlow.tsx
│   ├── FieldError.tsx
│   ├── FloatingInput.tsx
│   ├── FormStatus.tsx
│   ├── LegalModal.tsx
│   ├── PasswordInput.tsx
│   ├── PrimaryActionButton.tsx
│   └── SignInForm.tsx
├── constants/
│   ├── authErrors.ts
│   ├── emailErrors.ts
│   └── formLimits.ts
├── services/
│   ├── apiClient.ts
│   ├── authApi.ts
│   └── authToken.ts
├── types/
│   ├── auth.types.ts
│   ├── email.types.ts
│   └── registration.types.ts
├── utils/
│   ├── emailValidation.ts
│   ├── registrationValidation.ts
│   └── validation.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Frontend authentication flow

1. Registration validates the username and password in the browser, then calls the backend to check username availability.
2. The email step validates the email, then sends the account creation request to the backend.
3. Sign-in sends the username, password, and `rememberMe` flag to the backend.
4. A successful sign-in stores the short-lived access token in a private JavaScript module variable. Authenticated API calls can use the shared API client to attach it as a Bearer token.
5. On a fresh page load, the frontend asks the backend to restore the session using its HttpOnly refresh cookie. A new access token is returned to memory when a valid refresh cookie exists.
6. Sign-out asks the backend to revoke the refresh session and always clears the in-memory access token on the frontend.

There is no preview mode, mock API, fake account database, or browser storage fallback. If `VITE_AUTH_API_BASE_URL` is empty, API actions fail with a clear configuration error and no account information is saved.

## Backend API contract

The frontend expects the following endpoints below the configured API base URL.

### `POST /auth/username/check`

Request:

```json
{ "username": "reader12" }
```

Response:

```json
{ "exists": false }
```

Return `exists: true` when the username is already taken. For failed requests, return a JSON error such as `{ "code": "USERNAME_ALREADY_EXISTS" }`. The frontend recognizes `USERNAME_ALREADY_EXISTS`, `EMAIL_ALREADY_IN_USE`, `INVALID_CREDENTIALS`, `ACCOUNT_DISABLED`, and `RATE_LIMITED`.

### `POST /auth/register`

Request:

```json
{
  "username": "reader12",
  "password": "Example123",
  "email": "reader@example.com"
}
```

Return a successful 2xx response only after the account has been created. A `204 No Content` response is supported. The backend must independently validate all fields, enforce unique usernames and emails, hash passwords securely, and never store plain-text passwords.

### `POST /auth/login`

Request:

```json
{
  "username": "reader12",
  "password": "Example123",
  "rememberMe": true
}
```

Response:

```json
{
  "accessToken": "<short-lived-access-token>",
  "user": { "username": "reader12" }
}
```

The backend must issue the access token in the JSON response and keep the refresh token in an `HttpOnly` cookie. It must not return the refresh token in JSON. The `rememberMe` flag is a request for the backend to choose the refresh-cookie lifetime: persistent when true, session-scoped when false.

### `POST /auth/refresh`

The browser sends the refresh cookie automatically because the API client uses `credentials: 'include'`.

Response:

```json
{
  "accessToken": "<new-short-lived-access-token>",
  "user": { "username": "reader12" }
}
```

Return `401` or `403` when the refresh session is missing, expired, or revoked. The frontend treats that as a signed-out state.

### `POST /auth/logout`

Revoke the refresh session server-side and clear the refresh cookie. A successful `204 No Content` response is supported.

### Authenticated endpoints

Use `apiRequest` from `src/services/apiClient.ts` with `requiresAuth: true` for protected backend requests:

```ts
const profile = await apiRequest<Profile>('/profile', {
  method: 'GET',
  requiresAuth: true,
});
```

The client attaches `Authorization: Bearer <accessToken>`. Keep the response types aligned with the backend's actual contract.

## Token and session security

- The access token exists only in module memory. It is cleared on sign-out and disappears when the page is refreshed or closed.
- No `localStorage`, `sessionStorage`, IndexedDB, or JavaScript-readable refresh-token cookie is used.
- The refresh token must be an `HttpOnly`, `Secure` (in production), `SameSite` cookie, issued and revoked by the backend.
- The frontend never reads or creates the refresh cookie. `credentials: 'include'` only allows the browser to send/receive the backend-managed cookie.
- For cross-origin development, configure the backend CORS policy with the exact frontend origin and `Access-Control-Allow-Credentials: true`; do not use `*` with credentialed requests.
- Use HTTPS in production. The backend remains responsible for token expiry, refresh-token rotation, revocation, CSRF protections appropriate to its cookie policy, and authorization checks on protected routes.

## Form behavior

Sign-in username/password values and the `Remember me` checkbox are kept in React state while switching between sign-in and sign-up. They are not persisted by the frontend. The remember-me choice is sent to the backend as part of the login request; any persistence comes only from the backend-managed refresh cookie.

The sign-in inputs discourage browser autocomplete, but browser extensions and password managers may still override page-level controls.

## Legal links

Terms of Service and Privacy Policy open accessible dialogs. The included wording is starter copy and must be reviewed and adapted to the real service before public launch.
