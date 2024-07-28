// Load environment variables
import 'dotenv/config';

// Import dependencies
import express from 'express';
import cors from 'cors';
import { router } from './routers/router.js';
import jwt from 'jsonwebtoken';

// Create app
const app = express();

// Authorize CORS requests
app.use(cors('*')); // * = tous les domaines (pour nous faciliter la vie sur la saison future, mais en pratique, on devrait limiter l'accès à notre API uniquement au front qui va nous appeler !)

// Add body parser
app.use(express.urlencoded({ extended: true })); // Parser les bodies de type "application/www-form-urlencoded"
app.use(express.json()); // Parser les bodies de type "application/json"

// Add user to req if token exist and is valid
app.use((req, res, next) => {
  const authorization = req.headers.authorization;
  console.log(req.headers.authorization);

  if (authorization) {
    const token = authorization.split(' ')[1];
    try {
      const jwtContent = jwt.verify(token, process.env.JWTSECRET);
      req.user = jwtContent;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('Invalid token', err);
        return res.status(401).json({ error: 'Token has expired' });
      } else {
        console.log('Invalid token', err);
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
  }
  next();
});

// Configure routes
app.use('/api', router);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
