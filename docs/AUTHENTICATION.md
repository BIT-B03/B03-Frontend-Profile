# Authentication & Password Reset API

Base URL
- Development: http://localhost:5000
- Auth routes are mounted at: /api/auth

Content types
- JSON: application/json
- Register uses multipart/form-data because it uploads a PDF file.

Auth headers
- For protected endpoints (e.g., logout), send Authorization: Bearer <JWT>.

Environment variables (relevant)
- RESET_PASSWORD_FRONTEND_URL: Frontend page to open for resetting password; backend appends ?token=<TOKEN>.
- API_BASE_URL: Backend origin used only if RESET_PASSWORD_FRONTEND_URL is empty (fallback for verify link).
- Rate limit configs: FP_PER_IP_LIMIT, FP_PER_IP_WINDOW, FP_PER_EMAIL_LIMIT, FP_PER_EMAIL_WINDOW, FP_PER_EMAIL_DAILY_LIMIT, FP_EMAIL_COOLDOWN_SECONDS.

---

## 1) Register
- Method: POST
- URL: /api/auth/register
- Content-Type: multipart/form-data
- Body fields:
  - name (string, required)
  - username (string, required, unique)
  - password (string, required, min 6)
  - confirm_password (string, required, must match password)
  - email (string, optional; if empty, backend uses "<username>@community.com")
  - bio (string, optional)
  - cv_file (file, required, PDF only)
- Responses:
  - 201 Created
    {
      "message": "Pendaftaran berhasil! Menunggu konfirmasi admin.",
      "user_id": "<id>",
      "hashed_id": "<encoded>"
    }
  - 400 Bad Request: missing/invalid fields, username/email taken, password mismatch/too short, CV not PDF, generation not set.
  - 500 Internal Server Error on DB errors.

## 2) Login
- Method: POST
- URL: /api/auth/login
- Content-Type: application/json
- Body:
  {
    "username": "string",
    "password": "string"
  }
- Responses:
  - 200 OK
    {
      "access_token": "<jwt>",
      "user_id": "<id>|superuser",
      "role": "<role>",
      "position": "<position|null>",
      "name": "<name|null>",
      "email": "<email|null>"
    }
  - 400 Bad Request: missing username/password
  - 401 Unauthorized: wrong credentials

## 3) Logout
- Method: POST
- URL: /api/auth/logout
- Headers: Authorization: Bearer <jwt>
- Body: none
- Responses:
  - 200 OK
    { "message": "Anda berhasil logout." }
  - 401 Unauthorized if token invalid/expired

---

## 4) Forgot Password
- Method: POST
- URL: /api/auth/forgot-password
- Content-Type: application/json
- Body:
  { "email": "user@example.com" }
- Behavior:
  - Anti-enumeration: untuk email yang tidak terdaftar, tetap balasan generik 200 kecuali terkena rate limit.
  - Token disimpan di Redis (key: reset_password_token:<sha256(token)>, value: email) dengan TTL PASSWORD_RESET_TOKEN_TTL.
  - Email dikirim via provider (console/smtp) sesuai config.
- Rate limiting & cooldown:
  - Per-email cooldown: jika terlalu sering resend ke email yang sama → 429
    { "message": "Terlalu sering meminta reset. Coba lagi dalam <detik> detik." }
  - Per-IP window: jika melewati FP_PER_IP_LIMIT dalam FP_PER_IP_WINDOW → 429
    { "message": "Terlalu banyak permintaan dari IP Anda. Coba lagi dalam <detik> detik." }
  - Per-email window: jika melewati FP_PER_EMAIL_LIMIT dalam FP_PER_EMAIL_WINDOW → 429
    { "message": "Terlalu banyak permintaan reset untuk email ini. Coba lagi dalam <detik> detik." }
  - Per-email daily cap: jika melewati FP_PER_EMAIL_DAILY_LIMIT dalam 24h → 429
    { "message": "Batas harian permintaan reset untuk email ini telah tercapai. Coba lagi besok." }
- Success (generic response):
  - 200 OK
    { "message": "Permintaan reset password telah kami terima. Silakan periksa email Anda dalam beberapa menit." }

## 5) Verify Reset Token
- Method: GET
- URL: /api/auth/verify-reset-token?token=<TOKEN>
- Responses:
  - 200 OK
    { "valid": true, "message": "Token valid." }
  - 400 Bad Request
    { "valid": false, "message": "Token tidak valid atau telah kedaluwarsa." }
  - 500 Internal Server Error if Redis error

## 6) Reset Password
- Method: POST
- URL: /api/auth/reset-password
- Content-Type: application/json
- Body:
  {
    "token": "<TOKEN>",
    "new_password": "string (min 6)"
  }
- Responses:
  - 200 OK
    { "message": "Password berhasil direset." }
  - 400 Bad Request
    { "error": "Token dan password baru wajib diisi." }
    { "error": "Password baru minimal 6 karakter." }
    { "error": "Token tidak valid atau telah kedaluwarsa." }
  - 503 Service Unavailable
    { "error": "Reset password tidak tersedia saat ini." }  # jika Redis tidak terkonfigurasi
  - 500 Internal Server Error on DB/Redis errors
- Notes:
  - Token sekali pakai: setelah reset sukses, token dihapus dari Redis.

## Frontend integration notes
- Jika RESET_PASSWORD_FRONTEND_URL diisi (mis. https://app.example.com/reset-password), backend akan mengirim link: https://app.example.com/reset-password?token=<TOKEN>.
- Frontend perlu:
  1) Baca token dari query string
  2) Memanggil GET /api/auth/verify-reset-token?token=<TOKEN> untuk validasi awal (opsional, untuk UX)
  3) Memanggil POST /api/auth/reset-password dengan body { token, new_password }
- Tampilkan pesan limit dari backend (HTTP 429) apa adanya untuk UX yang jelas.

## Validation summary (untuk form frontend)
- Register (multipart/form-data):
  - name: required
  - username: required (unique)
  - password: required, min 6
  - confirm_password: required, equals password
  - email: optional (format email), jika kosong backend set <username>@community.com
  - bio: optional
  - cv_file: required, PDF extension
- Login (JSON):
  - username: required
  - password: required
- Forgot Password (JSON):
  - email: required, valid format
- Reset Password (JSON):
  - token: required
  - new_password: required, min 6

## Status codes quick ref
- 200 OK: login success, logout, forgot (generic), verify valid, reset success
- 201 Created: register success
- 400 Bad Request: invalid input, token invalid/expired
- 401 Unauthorized: login failed, or JWT invalid/expired (protected endpoints)
- 429 Too Many Requests: rate limit/cooldown
- 500 Internal Server Error: DB/Redis errors
- 503 Service Unavailable: reset-password when Redis not configured
