import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { insertUserSchema, loginUserSchema } from "./schema";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../db/index";
import { AuthRequest, AuthResponse } from "../../types/index";
import { hash } from "bcryptjs";
import { AuthService } from "../../services/authService";

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();
  // Register endpoint
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/auth/register",
    {
      schema: {
        body: insertUserSchema,
        description:
          "Register a new user account. Try with: test2@test.com / Test Silva / Test123!!!",
        tags: ["Authentication"],
      },
    },
    async (request, reply) => {
      try {
        const { email, name, password } = request.body as AuthRequest;

        console.log("Registering user:", { email, name });

        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (existingUser.length > 0) {
          return reply.status(409).send({
            success: false,
            error: "Email already registered",
          });
        }

        // Hash password and create user
        const passwordHash = await authService.hashPassword(password);

        const newUser = await db
          .insert(users)
          .values({
            email,
            name,
            passwordHash,
          })
          .returning({
            id: users.id,
            email: users.email,
            name: users.name,
          });

        const user = newUser[0]!;

        // Generate JWT token
        const token = authService.generateToken({
          userId: user.id,
          email: user.email,
        });

        const response: AuthResponse = {
          user,
          token,
        };

        return reply.status(201).send({
          success: true,
          data: response,
          message: "User registered successfully",
        });
      } catch (error: any) {
        console.error("Registration error:", error);

        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );

  // Login endpoint
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/auth/login",
    {
      schema: {
        body: loginUserSchema,
        description:
          "Login with email and password. Use the test credentials: test@test.com / Test123!!!",
        tags: ["Authentication"],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { email, password } = request.body as AuthRequest;

        // Find user by email
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const user = userResult[0];
        if (!user) {
          return reply.status(401).send({
            success: false,
            error: "Invalid credentials",
          });
        }

        // Verify password
        const isValidPassword = await authService.comparePasswords(
          password,
          user.passwordHash
        );
        if (!isValidPassword) {
          return reply.status(401).send({
            success: false,
            error: "Invalid credentials",
          });
        }

        // Generate JWT token
        const token = authService.generateToken({
          userId: user.id,
          email: user.email,
        });

        const response: AuthResponse = {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          token,
        };

        return reply.send({
          success: true,
          data: response,
          message: "Login successful",
        });
      } catch (error) {
        console.error("Login error:", error);
        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );
}
