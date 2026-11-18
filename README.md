# Temple Sign-In & Account Setup

A responsive account-creation flow built with React, Vite, TypeScript, and Tailwind CSS v4. It uses the supplied temple image as the full-page background and a moderately translucent glass panel.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

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
├── services/authApi.ts
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

## Account setup flow

1. The first step asks for a username, password, and repeated password.
2. Client-side validation checks the username, password rules, and whether both passwords match.
3. The username availability check runs through `src/services/authApi.ts`.
4. When the API reports that the username does not exist, the page advances to the email setup step.
5. The email is validated using the reusable email validator.
6. The final account request is sent to the backend when it is configured.

### Username requirements

- 3–8 characters after trimming leading and trailing spaces.

### Password requirements

- 8–24 characters.
- At least one uppercase letter (A–Z).
- At least one lowercase letter (a–z).
- At least one number (0–9).

## Backend connection contract

The frontend is prepared for these endpoints:

### `POST /auth/username/check`

Request:

```json
{ "username": "reader12" }
```

Response:

```json
{ "exists": false }
```

When `exists` is `true`, the user stays on the credentials step and sees a username-taken error. When it is `false`, the email setup step opens.

### `POST /auth/register`

Request:

```json
{
  "username": "reader12",
  "password": "Example123",
  "email": "reader@example.com"
}
```

The backend should validate all fields again, hash the password securely, enforce unique usernames/emails, and return a successful 2xx response only after account creation succeeds. It should never store plain-text passwords. Use HTTPS for all production authentication requests.

Configure the API base URL by copying `.env.example` to `.env.local` and setting:

```env
VITE_AUTH_API_BASE_URL=http://localhost:3000/api
```

The endpoint paths are appended to this base URL.

## Preview mode before the backend exists

When `VITE_AUTH_API_BASE_URL` is empty, the frontend enters preview mode. It assumes the username is available so the email step can be tested. **This is not a database check.** Submitting the email displays a message that the backend is not connected and confirms that the details have not been saved.

No `localStorage`, cookies, or browser persistence are used. Form values remain in React memory only and are lost when the page is refreshed.

## Legal links and sign-in navigation

The signup flow includes Terms of Service and Privacy Policy links. Each opens an accessible, centered dialog over a blurred backdrop; dialogs close with the close control, backdrop click, or Escape key. The included legal wording is starter copy and must be reviewed and adapted to the real service before public launch.

The signup footer opens the existing username/password sign-in form, and the sign-in form links back to account creation.

## Existing sign-in and email utilities

The username/password sign-in form and separate email validator remain available for reuse. The displayed page currently runs the account-setup flow. Shared field limits, field errors, status messages, and primary-button styling are kept in reusable modules to avoid duplicated rules and markup.

## Form state between pages

Sign-in username and password values are held in `AccountSetupFlow`, above the conditional sign-in/sign-up view. Switching between those views keeps the values in React memory. They start blank again after a full page reload because no `localStorage`, `sessionStorage`, or cookie persistence is used.

The sign-in form disables browser autocomplete and starts its fields as read-only until the user focuses them. This discourages automatic credential restoration while preserving in-session values when switching between the two views. Browser extensions or password managers may still override page-level controls.

### Remember me

The sign-in page includes a controlled `Remember me` checkbox. Its selection is held in React state across sign-in/sign-up navigation and resets on a full page reload. It does not persist a session yet; the flag is reserved for the future authentication integration.
