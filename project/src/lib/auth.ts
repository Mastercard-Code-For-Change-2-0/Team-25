import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "admin" | "donor" | "student";
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check for token in cookies
  const token = request.cookies.get("auth-token")?.value;
  return token || null;
}

export function createAuthResponse(user: any, message: string = "Success") {
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    message,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      donorType: user.donorType,
      receiverSubtype: user.receiverSubtype,
    },
    token,
  };
}
