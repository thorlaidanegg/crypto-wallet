import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import connectMongo from '@/lib/dbConnect';
import User from '@/models/User';

const authOptions = {
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
    async signIn({ user, account, profile }) {
      await connectMongo();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          username: profile.name || user.name,
          email: user.email,
          provider: account.provider,
          providerId: account.providerAccountId,
          wallets: 0,
          solanaWallets: 0,
          ethWallets: 0,
        });
      }

      return true;
    },
    async session({ session, token }) {
      session.userId = token.sub;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.accessToken;
        token.sub = user?.id || token.sub;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
