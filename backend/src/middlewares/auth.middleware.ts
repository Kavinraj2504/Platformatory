

import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token' });
    return;
  }

  jwt.verify(token,process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }
    req.user = user; 
    next();
  });
};
