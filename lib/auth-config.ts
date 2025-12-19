// NextAuth configuration
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

// Validate email configuration
function getEmailServerConfig() {
  // If EMAIL_SERVER is set as a connection string, use it directly
  if (process.env.EMAIL_SERVER) {
    console.log("✅ Using EMAIL_SERVER connection string");
    return process.env.EMAIL_SERVER;
  }

  // Otherwise, try to build from SMTP_* variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  let smtpUser = process.env.SMTP_USER;
  let smtpPassword = process.env.SMTP_PASSWORD;

  // Clean up values that might have variable name prefixes (e.g., "MAIL_USERNAME=email@example.com")
  if (smtpUser && smtpUser.includes('=')) {
    const parts = smtpUser.split('=');
    if (parts.length > 1) {
      smtpUser = parts.slice(1).join('='); // Take everything after the first '='
      console.warn("⚠️  SMTP_USER had a prefix, cleaned to:", smtpUser);
    }
  }
  if (smtpPassword && smtpPassword.includes('=') && !smtpPassword.startsWith('=')) {
    const parts = smtpPassword.split('=');
    if (parts.length > 1 && parts[0].toUpperCase().includes('PASSWORD')) {
      smtpPassword = parts.slice(1).join('=');
      console.warn("⚠️  SMTP_PASSWORD had a prefix, cleaned it");
    }
  }

  // Check if we have the minimum required configuration
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    const missing = [];
    if (!smtpHost) missing.push("SMTP_HOST");
    if (!smtpPort) missing.push("SMTP_PORT");
    if (!smtpUser) missing.push("SMTP_USER");
    if (!smtpPassword) missing.push("SMTP_PASSWORD");
    
    console.error("⚠️  Email configuration is incomplete. Missing:", missing.join(", "));
    console.error("Please set EMAIL_SERVER or SMTP_* environment variables. See SETUP.md for details.");
    console.error("Current values:", {
      SMTP_HOST: smtpHost ? "✓ Set" : "✗ Missing",
      SMTP_PORT: smtpPort ? "✓ Set" : "✗ Missing",
      SMTP_USER: smtpUser ? "✓ Set" : "✗ Missing",
      SMTP_PASSWORD: smtpPassword ? "✓ Set (hidden)" : "✗ Missing",
    });
    
    // Return a minimal config that will fail gracefully
    return {
      host: smtpHost || "localhost",
      port: Number(smtpPort) || 587,
      auth: {
        user: smtpUser || "",
        pass: smtpPassword || "",
      },
    };
  }

  const port = Number(smtpPort);
  const isSecurePort = port === 465;
  
  console.log("✅ Email configuration found. Using SMTP:", {
    host: smtpHost,
    port: port,
    secure: isSecurePort,
    user: smtpUser,
    password: smtpPassword ? "***" : "missing",
  });

  // Configure SMTP options based on port
  const smtpConfig: any = {
    host: smtpHost,
    port: port,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  };

  // Port 465 requires secure: true, port 587 uses STARTTLS
  if (isSecurePort) {
    smtpConfig.secure = true;
  } else {
    smtpConfig.secure = false;
    smtpConfig.requireTLS = true;
  }

  return smtpConfig;
}

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: getEmailServerConfig(),
      from: process.env.EMAIL_FROM || "noreply@contractops-ai.com",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async signIn({ user, account, profile, email }: any) {
      // Allow all email sign-ins
      return true;
    },
    async session({ session, user }: any) {
      if (session.user?.email) {
        try {
          // Get user from database
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
          });

          // Create user if doesn't exist (first login)
          if (!dbUser) {
            const newUser = await prisma.user.create({
              data: {
                email: session.user.email,
                name: session.user.name || null,
                plan: "free",
                analysisCount: 0,
              },
            });

            // Add user ID and plan to session
            (session as any).user.id = newUser.id;
            (session as any).user.plan = newUser.plan;
            (session as any).user.analysis_count = newUser.analysisCount;
          } else {
            // Add user ID and plan to session
            (session as any).user.id = dbUser.id;
            (session as any).user.plan = dbUser.plan;
            (session as any).user.analysis_count = dbUser.analysisCount;
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }

      return session;
    },
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || (() => {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXTAUTH_SECRET is required in production");
    }
    // For development, use a temporary secret if not set
    console.warn("⚠️  NEXTAUTH_SECRET is not set. Using a temporary secret for development.");
    return "temporary-dev-secret-change-in-production";
  })(),
};

// Export auth function for NextAuth v5
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
