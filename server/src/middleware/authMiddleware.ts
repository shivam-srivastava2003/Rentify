import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(401).json({ success: false, message: 'Not authorized. User account no longer exists.' });
        return;
      }

      if (user.isActive === false) {
        res.status(403).json({ success: false, message: 'Your account has been deactivated or disabled by administrator.' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized. Session token invalid or expired.' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized. No session token provided.' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Access forbidden. Insufficient administrative permissions.' });
      return;
    }
    next();
  };
};
