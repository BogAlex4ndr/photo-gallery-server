import { body } from 'express-validator';

export const registerValidator = [
  body('email', 'wrong email format').isEmail(),
  body('password', `cant't be less then 5 symbols`).isLength({ min: 5 }),
  body('fullName', 'sey your name').isLength({ min: 3 }),
];

export const loginValidator = [
  body('email', 'wrong email format').isEmail(),
  body('password', `cant't be less then 5 symbols`).isLength({ min: 5 }),
];

export const PostValidator = [body('text', 'wrong email format').isString()];
