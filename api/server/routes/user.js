import { hash, compare } from 'bcrypt';
import client from '../db/config';
import { query } from '../queries';
import { registerationValidators, loginValidators, validatorResponse } from '../middleware/validation';
import { authorizeUser } from '../middleware/auth';
import {
  errorResponse, trimData, generateToken
} from '../utils';

const userRoutes = (app, prefix) => {
  /**
   * POST /users/register
   * Purpose: Sign up new user
   */
  app.post(`${prefix}/users/register`,
    registerationValidators,
    validatorResponse,
    async (req, res) => {
      try {
        const {
          name, email, password, confirmPassword, phone
        } = req.body;

        const newUser = {
          name, email, password, confirmPassword, phone
        };

        const existingEmail = await client.query(query.getUserDataForVerification(email));
        if (existingEmail.rowCount > 0) return errorResponse([{ msg: 'Email has already been used' }], 409, res);
        
        trimData(newUser);
        const hashedPassword = await hash(newUser.password, 12);
        await client.query(query.createUser(newUser, hashedPassword));
        const user = await client.query(query.findUser(email));
        const token = await generateToken(user.rows[0]);

        return res.status(201).json({ success: true, token });
      } catch (error) {
        res.json(error);
      }
    });

  /**
   * POST /users/login
   * Purpose: Login registered user
   */
  app.post(`${prefix}/users/login`,
    loginValidators,
    validatorResponse,
    async (req, res) => {
      try {
        const { email, password } = req.body;

        const user = await client.query(query.getUserDataForVerification(email));
        if (user.rowCount === 0) return errorResponse([{ msg: 'Email or password is incorrect' }], 400, res);

        const passwordMatched = await compare(password, user.rows[0].password);
        if (!passwordMatched) return errorResponse([{ msg: 'Email or password is incorrect' }], 400, res);
        
        const token = await generateToken(user.rows[0]);

        return res.status(200).json({ success: true, token });
      } catch (error) {
        res.json(error);
      }
    });

  /**
   * GET /user
   * Purpose: Get logged-in user profile
   */
  app.get(`${prefix}/user`,
    authorizeUser,
    async (req, res) => {
      try {
        const userId = req.user;

        const user = await client.query(query.findUserById(userId));
        if (user.rowCount === 0) return errorResponse([{ msg: 'User does not exist' }], 404, res);

        return res.status(200).json({ success: true, user: user.rows[0] });
      } catch (error) {
        res.json(error);
      }
    });
  
  /**
   * PUT /user
   * Purpose: update logged-in user profile
   */
  app.put(`${prefix}/user`,
    authorizeUser,
    async (req, res) => {
      try {
        const userId = req.user;
        const { name, phone } = req.body;

        const user = await client.query(query.findUserById(userId));
        if (user.rowCount === 0) return errorResponse([{ msg: 'User does not exist' }], 404, res);

        const userUpdateDetails = {
          name: name || (user.rows[0].name || ''),
          phone: phone || (user.rows[0].phone || '')
        };
      
        await trimData(userUpdateDetails);
        await client.query(query.updateUserDetails(
          userUpdateDetails.name, userUpdateDetails.phone, userId
        ));
        const update = await client.query(query.findUserById(userId));

        return res.status(200).json({ success: true, user: update.rows[0] });
      } catch (error) {
        res.json(error);
      }
    });
};

export default userRoutes;
