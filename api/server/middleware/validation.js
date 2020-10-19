import { check, validationResult } from 'express-validator';
import { errorResponse } from '../utils';

export const registerationValidators = [
  check('name')
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 chars long'),
  check('email')
    .isEmail()
    .withMessage('email is either absent or not valid'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 chars long')
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("confirm password doesn't match with password");
      } else {
        return value;
      }
    }),
  check('phone')
    .isLength({ min: 7, max: 15 })
    .withMessage('phone number must be at least 7 characters or at most 15 characters'),
];

export const loginValidators = [
  check('email').trim()
    .not().isEmpty()
    .withMessage('email cannot be empty'),
  check('password').trim()
    .not().isEmpty()
    .withMessage('password cannot be empty')
];

export const contactValidators = [
  check('name')
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 chars long'),
  check('email')
    .isEmail()
    .withMessage('email is either absent or not valid'),
  check('phone')
    .isLength({ min: 7, max: 15 })
    .withMessage('phone number must be at least 7 characters or at most 15 characters'),
];

export const validatorResponse = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return errorResponse(errors.array(), 422, res);
  }

  next();
};
