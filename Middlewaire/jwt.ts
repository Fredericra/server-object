import { NextFunction, Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const jwtSecret: Secret = process.env.JWT_SECRET || 'default-jwt-secret';

export interface JwtPayload {
  username?: string;
  [key: string]: any;
}

export function signJwtToken(payload: JwtPayload, expiresIn: string | number = '1h'): string {
  return jwt.sign(payload as string | Buffer | object, jwtSecret, {
    expiresIn,
  } as SignOptions);
}

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    (req as any).user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
