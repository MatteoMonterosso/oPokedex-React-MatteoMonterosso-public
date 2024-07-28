import { User } from '../models/User.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';

export async function logUser(req, res) {
  console.log('>> POST /login', req.body);
  const { email, password } = req.body;

  // authentication
  const user = await User.findOne({
    where: { [Op.and]: [{ email: email }, { password: password }] },
  });

  console.log(user);

  // http response
  if (user) {
    const jwtContent = { userId: user.id };
    const jwtOptions = {
      algorithm: 'HS256',
      expiresIn: '3h',
    };
    console.log('<< 200', user.username);
    res.json({
      logged: true,
      pseudo: user.username,
      token: jwt.sign(jwtContent, process.env.JWTSECRET, jwtOptions),
    });
  } else {
    console.log('<< 401 UNAUTHORIZED');
    res.sendStatus(401);
  }
}
