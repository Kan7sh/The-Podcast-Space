import { db } from "@/db/db";
import { UserTable } from "@/db/schema";
import { verifyPassword } from "@/lib/hashPassword";
import { and, eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const AuthOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, user.email!),
          });

          if (!existingUser) {
            await db.insert(UserTable).values({
              name: user.name || "",
              email: user.email!,
              imageUrl: user.image,
              authType: "google",
              googleId: user.id,
            });
          }
        } catch (error) {
          return false;
        }
      }

      return true;
    },
    async jwt({ trigger, token, user, account }) {
      if (trigger === "update" || account?.provider === "google" || user) {
        const email = user?.email || token.email;
        if (email) {
          const dbUser = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, email as string),
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.imageUrl;
          }
        }
      }

      // Handle credentials sign in
      if (user && !account?.provider) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.picture as string,
        };
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await db.query.UserTable.findFirst({
          where: and(eq(UserTable.email, credentials.email)),
        });

        if (!user) {
          return null;
        }
        if (user.password !== null) {
          const isPasswordCorrect = await verifyPassword(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              image: user.imageUrl,
            };
          } else {
            return null;
          }
        }

        return null;
      },
    }),
  ],
};
