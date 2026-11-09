## 2024-05-18 - Prevent Error Detail Information Disclosure
**Vulnerability:** API endpoints were leaking error stack details or upstream API provider internal error messages (e.g., Gemini errors, API keys, etc.) directly to the client interface using `error.message`.
**Learning:** Found in standard try-catch blocks throughout `server.ts`. This occurs because developers try to provide context when an error happens, without considering the sensitive information the error object may hold.
**Prevention:** Catch all exceptions, log them securely on the server-side with `console.error`, and always return sanitized, static, and user-friendly error messages (e.g. `{"error": "Failed to complete request"}`) back to the client.

## 2025-02-28 - Missing Baseline Security Headers and Stack Fingerprinting
**Vulnerability:** The application was exposing the `X-Powered-By: Express` header, leaking information about the underlying server stack. Furthermore, it lacked essential security headers such as `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection`.
**Learning:** Default Express applications do not inherently provide these basic protections, requiring explicit configuration. Leaving `X-Powered-By` enabled facilitates targeted attacks by fingerprinting the server stack.
**Prevention:** Always disable the `X-Powered-By` header using `app.disable('x-powered-by')` and implement a security middleware (or use libraries like Helmet) to inject standard security headers for all routes in the application.
