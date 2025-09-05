import { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Import AuthService here to avoid circular dependency issues with config loading
    const { AuthService } = await import("../services/authService.js");
    const authService = new AuthService();

    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return reply.status(401).send({
        success: false,
        error: "Access token required",
      });
    }

    const payload = authService.verifyToken(token);
    request.user = payload;
  } catch (error) {
    return reply.status(403).send({
      success: false,
      error: "Invalid or expired token",
    });
  }
}
