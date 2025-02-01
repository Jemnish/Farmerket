# **Farmerket - Secure Web Application**

## **Overview**

Farmerket is a secure MERN-based web application designed with robust security measures to protect user data and ensure a safe user experience. The platform implements various security practices, following OWASP guidelines, to mitigate common web vulnerabilities and strengthen authentication, authorization, and data protection mechanisms.

## **Features**

- **Authentication & Authorization**

  - Password hashing using bcrypt.js
  - JWT-based session management
  - Multi-Factor Authentication (MFA)
  - Account lockout after multiple failed attempts

- **Security Enhancements**
  - Input validation and sanitization using `sanitize-html`
  - CSRF protection using `csurf`
  - Secure session and token management with HTTP-only cookies and token expiration
  - Rate limiting using `express-rate-limit`
  - Google reCAPTCHA integration for bot protection
  - File type verification for secure image uploads
- **Data Security**
  - Enforced HTTPS with Let's Encrypt SSL
  - Secured MongoDB with authentication & role-based access control (RBAC)
  - `.gitignore` includes `.env` and other sensitive files to prevent accidental exposure

## **Technology Stack**

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt.js, MFA
- **Security**: OWASP-compliant practices, HTTPS, input validation, secure session management

## **Installation & Setup**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/farmerket.git
   cd farmerket
   ```
2. **Install dependencies:**
   ```bash
   npm install  # Install backend dependencies
   cd client && npm install  # Install frontend dependencies
   ```
3. **Set up environment variables:**  
   Create a `.env` file in the root directory and configure the required environment variables such as database credentials, JWT secret, and API keys.
4. **Run the application:**
   ```bash
   npm start  # For both backend and frontend
   ```

## **Security Considerations**

- **Identified Vulnerabilities & Fixes:**
  - **Password Cracking**: Resolved by implementing bcrypt hashing
  - **Session Hijacking**: Prevented with secure cookies and token expiration
  - **XSS Attacks**: Mitigated through input sanitization with `sanitize-html`
- **Rate Limiting & Bot Protection:**
  - `express-rate-limit` prevents brute-force login attempts
  - Google reCAPTCHA blocks bot-driven login and registration
- **Secure Data Storage & Transmission:**
  - HTTPS enforces encrypted communication
  - MongoDB access restricted with authentication & role-based access control

## **Acknowledgment**

We sincerely thank our module leader for guiding us through the crucial aspects of application security, ethical hacking, Linux, and system security. His teachings have expanded our knowledge beyond development, making us aware of real-world threats and best security practices.

## **License**

This project is licensed under the MIT License - see the LICENSE file for details.
