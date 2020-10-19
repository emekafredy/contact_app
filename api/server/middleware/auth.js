import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils';

export const authorizeUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return errorResponse('Please provide a token', 403, res);

    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return errorResponse('Invalid token. Please sign in again.', 401, res);
      }
      req.user = decoded.id;
      return next();
    });
  } catch (err) { /* istanbul ignore next */
    return errorResponse(err, 500, res);
  }
};
