// /app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import connectMongo from '@/lib/dbConnect'; // Ensure this path is correct
import User from '@/models/User'; // Ensure this path is correct

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await connectMongo();

      // Check if user already exists
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create a new user
        await User.create({
          username: profile.name || user.name,
          email: user.email,
          provider: account.provider,
          providerId: account.id,
          // Optional: add any additional default fields, like wallets, etc.
          wallets: 0,
          solanaWallets: 0,
          ethWallets: 0,
        });
      }

      return true;
    },

    async session({ session, token, user }) {
      // Pass the user ID or any other data to the session
      session.userId = user?.id || token?.sub;
      session.accessToken = token.accessToken;
      return session;
    },

    async jwt({ token, account, user }) {
      // Store user ID and accessToken in the JWT token
      if (account) {
        token.accessToken = account.accessToken;
        token.userId = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
