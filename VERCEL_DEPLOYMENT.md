# Vercel Deployment Guide for ContractOps AI

This guide will walk you through deploying your Next.js application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A MySQL database (you can use Vercel Postgres, PlanetScale, or any MySQL provider)
4. OpenAI API key
5. SMTP/Email service credentials (for NextAuth email authentication)

## Step-by-Step Deployment

### Step 1: Prepare Your Database

You'll need a MySQL database. Here are some options:

**Option A: Vercel Postgres (Recommended)**
- Go to your Vercel project dashboard
- Navigate to Storage → Create Database → Postgres
- Note: You'll need to update your Prisma schema to use `postgresql` instead of `mysql` if you choose this option

**Option B: PlanetScale (MySQL)**
- Sign up at [PlanetScale](https://planetscale.com)
- Create a new database
- Get your connection string

**Option C: Other MySQL Providers**
- Railway, Supabase, or any MySQL-compatible database
- Get your connection string

### Step 2: Push Your Code to Git

If you haven't already, push your code to GitHub, GitLab, or Bitbucket:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Method A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"

2. **Import Your Repository**
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your `contractops-ai` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (already configured)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add the following:

   **Required Variables:**
   ```
   DATABASE_URL=your_mysql_connection_string
   NEXTAUTH_SECRET=generate_a_random_secret_here
   NEXTAUTH_URL=https://your-project.vercel.app
   OPENAI_API_KEY=your_openai_api_key
   ```

   **Email Configuration (choose one):**
   
   **Option 1: Using EMAIL_SERVER (connection string)**
   ```
   EMAIL_SERVER=smtp://username:password@smtp.example.com:587
   EMAIL_FROM=noreply@yourdomain.com
   ```
   
   **Option 2: Using SMTP variables**
   ```
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASSWORD=your_email_password
   EMAIL_FROM=noreply@yourdomain.com
   ```

   **How to generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Or use an online generator: https://generate-secret.vercel.app/32

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

#### Method B: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

4. **Add Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add OPENAI_API_KEY
   vercel env add SMTP_HOST
   vercel env add SMTP_PORT
   vercel env add SMTP_USER
   vercel env add SMTP_PASSWORD
   vercel env add EMAIL_FROM
   ```

5. **Run Database Migrations**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Step 4: Run Database Migrations

After your first deployment, you need to run Prisma migrations to set up your database schema.

**Option A: Using Vercel CLI**
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Using Prisma Studio (for manual setup)**
```bash
vercel env pull .env.local
npx prisma studio
```

**Option C: Add a build script**
You can also add migrations to your build process by updating `package.json`:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

### Step 5: Verify Deployment

1. Visit your deployment URL (e.g., `https://your-project.vercel.app`)
2. Test the application:
   - Try signing in with email
   - Upload a contract
   - Verify analysis works

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | MySQL connection string | `mysql://user:pass@host:3306/dbname` |
| `NEXTAUTH_SECRET` | ✅ Yes | Secret for NextAuth session encryption | Random 32+ character string |
| `NEXTAUTH_URL` | ✅ Yes | Your app's public URL | `https://your-project.vercel.app` |
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for contract analysis | `sk-...` |
| `EMAIL_SERVER` | ⚠️ Conditional | SMTP connection string (alternative to SMTP_*) | `smtp://user:pass@host:587` |
| `SMTP_HOST` | ⚠️ Conditional | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | ⚠️ Conditional | SMTP server port | `587` or `465` |
| `SMTP_USER` | ⚠️ Conditional | SMTP username/email | `your-email@gmail.com` |
| `SMTP_PASSWORD` | ⚠️ Conditional | SMTP password/app password | `your-app-password` |
| `EMAIL_FROM` | ✅ Yes | Email address for sending auth emails | `noreply@yourdomain.com` |

## Troubleshooting

### Build Fails with Prisma Errors

**Problem**: `PrismaClient is not generated`

**Solution**: 
- Ensure `postinstall` script is in `package.json` (already added)
- Check that `prisma generate` runs during build
- Verify `DATABASE_URL` is set correctly

### Database Connection Errors

**Problem**: Cannot connect to database

**Solution**:
- Verify `DATABASE_URL` format is correct
- Check database allows connections from Vercel IPs
- For PlanetScale, ensure you're using the production branch connection string
- Check database credentials are correct

### Email Authentication Not Working

**Problem**: Sign-in emails not sending

**Solution**:
- Verify SMTP credentials are correct
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)
- Check `EMAIL_FROM` matches your SMTP account
- Verify SMTP port (587 for TLS, 465 for SSL)

### OpenAI API Errors

**Problem**: Contract analysis fails

**Solution**:
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI API quota and billing
- Ensure API key has proper permissions

### Canvas/PDF Parsing Issues

**Problem**: Build fails with canvas-related errors

**Solution**:
- Vercel automatically handles native dependencies
- If issues persist, check that `@napi-rs/canvas` is in dependencies
- The `serverExternalPackages` in `next.config.ts` should help

## Post-Deployment Checklist

- [ ] Database migrations completed successfully
- [ ] Environment variables are set correctly
- [ ] Email authentication works (test sign-in)
- [ ] File upload works
- [ ] Contract analysis completes successfully
- [ ] PDF export works
- [ ] Custom domain configured (optional)
- [ ] Analytics/monitoring set up (optional)

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` environment variable to match your custom domain
5. Follow DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys when you push to your main branch. For other branches:
- Push to a branch → Vercel creates a preview deployment
- Merge to main → Vercel creates a production deployment

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

## Quick Deploy Button

You can also use this button to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/contractops-ai)

(Update the repository URL in the button link)

