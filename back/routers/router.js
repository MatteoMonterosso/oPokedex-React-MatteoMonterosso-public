import { Router } from 'express';
import * as pokemonControler from '../controllers/pokemonControler.js';
import * as typeControler from '../controllers/typeControler.js';
import * as teamControler from '../controllers/teamControler.js';
import * as userControler from '../controllers/UserController.js';

export const router = Router();

const checkLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    console.log('<< 401 UNAUTHORIZED');
    res.sendStatus(401);
  } else {
    next();
  }
};

// Routes des Pokemons
router.get('/pokemons', pokemonControler.getAllPkm);
router.get('/pokemons/:id', pokemonControler.getPkmById);

// Routes des Types
router.get('/types', typeControler.getAllTypes);

// Routes des Teams
router.get('/teams', checkLoggedIn, teamControler.getAllTeams);

// router.get('/teams/:id', teamControler.getTeamById);

router.post('/teams', checkLoggedIn, teamControler.createTeam);

router.patch('/teams/:id', checkLoggedIn, teamControler.patchTeam);

router.delete('/teams/:id', checkLoggedIn, teamControler.deleteTeam);

router.put(
  '/teams/:teamId/pokemons/:pkmId',
  checkLoggedIn,
  teamControler.putPkmIntoTeam
);

router.delete(
  '/teams/:teamId/pokemons/:pkmId',
  checkLoggedIn,
  teamControler.removePkmFromTeam
);

// Routes Auth
router.post('/login', userControler.logUser);
