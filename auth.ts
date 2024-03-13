import NextAuth from 'next-auth';
import {authConfig} from './auth.config';
import Credentials from "@auth/core/providers/credentials";
import {z} from "zod";
import {sql} from "@vercel/postgres";
import type {User} from "@/app/lib/definitions";
import bcrypt from 'bcrypt'

const AuthValidateConfig = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (e) {
    console.error('Failed to fetch user:', e);
    throw new Error('Failed to fetch user.');
  }
}

export const {auth, signIn, signOut} = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = AuthValidateConfig.safeParse(credentials);
      if (!parsedCredentials.success) return null;
      const {email, password} = parsedCredentials.data;
      const user = await getUser(email);
      if (user && await bcrypt.compare(password, user.password)) return user;
      return null;
    }
  })],
});