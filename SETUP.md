# Setup Instructions

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenAI API Key (existing)
OPENAI_API_KEY=your_openai_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_string_here

# Database Configuration (MySQL with Prisma)
DATABASE_URL=mysql://username:password@localhost:3306/contractops_ai

# Email Configuration (for magic link)
# Option 1: Use a service like SendGrid, Resend, etc.
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com

# Option 2: Use SMTP directly
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@yourdomain.com

# Google OAuth Configuration (optional - for Google login)
# Get credentials from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Database Setup (MySQL with Prisma)

1. **Install MySQL** (if not already installed):
   - Download from [MySQL official website](https://dev.mysql.com/downloads/)
   - Or use a cloud service like PlanetScale, AWS RDS, etc.

2. **Create a MySQL database**:
   ```sql
   CREATE DATABASE contractops_ai;
   ```

3. **Fix MySQL Authentication Plugin** (if using MySQL 8.0+):
   
   MySQL 8.0+ uses `caching_sha2_password` by default, which may cause authentication errors. 
   You need to change your MySQL user to use `mysql_native_password` instead:
   
   ```sql
   -- Connect to MySQL as root
   mysql -u root -p
   
   -- Change the authentication method for your user
   ALTER USER 'your_username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
   
   -- Or if you need to create a new user:
   CREATE USER 'your_username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
   GRANT ALL PRIVILEGES ON contractops_ai.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;
   ```
   
   **Alternative**: If you can't change the user authentication, you can add connection parameters to the DATABASE_URL:
   ```
   DATABASE_URL=mysql://username:password@localhost:3306/contractops_ai?auth_plugin=mysql_native_password
   ```

4. **Set up the DATABASE_URL** in `.env.local`:
   ```
   DATABASE_URL=mysql://username:password@localhost:3306/contractops_ai
   ```
   Replace `username`, `password`, `localhost`, `3306`, and `contractops_ai` with your actual MySQL credentials.

5. **Run Prisma migrations** to create the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```
   This will create all the necessary tables based on the Prisma schema.

6. **Generate Prisma Client** (if not already done):
   ```bash
   npx prisma generate
   ```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run the development server:
```bash
npm run dev
```

## Google OAuth Setup (Optional)

1. **Go to Google Cloud Console**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`
   - Copy the Client ID and Client Secret

4. **Add to `.env.local`**:
   ```bash
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

5. **Restart your development server**

## Features Implemented

- ✅ NextAuth email magic link authentication
- ✅ Google OAuth login (optional)
- ✅ MySQL database with Prisma ORM
- ✅ Usage limits (1 free analysis, then redirect to pricing)
- ✅ Subscription plans page (Basic ₹999, Standard ₹1499, Premium ₹2999)
- ✅ Subscription request flow with QR code modal
- ✅ Dashboard with placeholder charts
- ✅ Hindi/English language toggle (default: English)
- ✅ Route protection for authenticated pages
- ✅ Brand color #FF9933 applied throughout
- ✅ All analysis results saved to MySQL database

## Notes

- The QR code in the subscribe page is a placeholder - replace with actual Payphone QR code integration
- Email service needs to be configured for magic link authentication to work
- Google OAuth is optional - users can sign in with either email (magic link) or Google
- If Google OAuth is not configured, only email login will be available
- Admin approval for subscriptions is manual (future feature)
- All existing contract analysis functionality is preserved
- Users get 1 free analysis regardless of login method (email or Google)

