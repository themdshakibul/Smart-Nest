import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("smart-nest");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: user.role || "tenant",
            },
          };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        default: "tenant",
        type: "string",
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy:'jwt',
      maxAge: 60 * 60 * 24 * 30,
    },
  },
  plugins: [jwt()],
});