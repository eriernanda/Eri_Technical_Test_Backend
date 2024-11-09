import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/users/user-jwt-payload.interface';

@Injectable()
export class LeadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Token format is incorrect' });
    }

    try {
      const decoded = jwt.verify(token, 'n3St-sLAse34)') as JwtPayload;
      req['user'] = decoded;
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    next();
  }
}
