## 2024-05-18 - Prevent Error Detail Information Disclosure
**Vulnerability:** API endpoints were leaking error stack details or upstream API provider internal error messages (e.g., Gemini errors, API keys, etc.) directly to the client interface using `error.message`.
**Learning:** Found in standard try-catch blocks throughout `server.ts`. This occurs because developers try to provide context when an error happens, without considering the sensitive information the error object may hold.
**Prevention:** Catch all exceptions, log them securely on the server-side with `console.error`, and always return sanitized, static, and user-friendly error messages (e.g. `{"error": "Failed to complete request"}`) back to the client.
