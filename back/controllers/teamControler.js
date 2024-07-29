import { Team, Pokemon, Type, User, sequelize } from '../models/index.js';
import jwt from 'jsonwebtoken';

export async function getAllTeams(req, res) {
  // const user = await User.findByPk()

  console.log(req.user);

  const teams = await Team.findAll({
    include: 'pokemons',
    where: { userId: req.user.userId },
    order: [
      ['id', 'ASC'], // Trier par l'ID des Pokémon en ordre decroissant
      ['pokemons', 'id', 'ASC'], // Trier par l'ID des Types en ordre decroissant
    ],
  });

  if (!teams) {
    return res.status(404).json('Pas de team en bdd');
  }
  console.log('User Teams fetched');
  res.status(200).json(teams);
}

export async function getTeamById(req, res) {
  const teamId = req.params.id;
  const team = await Team.findByPk(teamId, {
    include: [
      {
        model: Pokemon,
        as: 'pokemons',
        include: [
          {
            model: Type,
            as: 'types',
          },
        ],
      },
    ],
    order: [
      ['id', 'ASC'], // Trier par l'ID des Pokémon en ordre decroissant
      ['pokemons', 'id', 'ASC'], // Trier par l'ID des Types en ordre decroissant
    ],
  });

  if (!team) {
    return res.status(404).json('Pas de team en bdd');
  }
  res.status(200).json(team);
}

export async function putPkmIntoTeam(req, res) {
  try {
    const team = await Team.findByPk(req.params.teamId);
    const pokemon = await Pokemon.findByPk(req.params.pkmId);

    if (!team || !pokemon) {
      throw new Error('Team or Pokemon not found');
    }

    await team.addPokemon(pokemon);
    const updatedteam = await Team.findByPk(req.params.teamId, {
      include: [
        {
          model: Pokemon,
          as: 'pokemons',
          include: [
            {
              model: Type,
              as: 'types',
            },
          ],
        },
      ],
      order: [
        ['id', 'ASC'], // Trier par l'ID des Pokémon en ordre decroissant
        ['pokemons', 'id', 'ASC'], // Trier par l'ID des Types en ordre decroissant
      ],
    });
    console.log(`Pokemon ${pokemon.name} added to team ${team.name}`);

    res.status(200).json(updatedteam);
  } catch (error) {
    console.error('Error adding Pokemon to team:', error);
  }
}

export async function removePkmFromTeam(req, res) {
  try {
    const team = await Team.findByPk(req.params.teamId);
    const pokemon = await Pokemon.findByPk(req.params.pkmId);

    if (!team || !pokemon) {
      throw new Error('Team or Pokemon not found');
    }

    await team.removePokemon(pokemon);

    const updatedteam = await Team.findByPk(req.params.teamId, {
      include: [
        {
          model: Pokemon,
          as: 'pokemons',
          include: [
            {
              model: Type,
              as: 'types',
            },
          ],
        },
      ],
      order: [
        ['id', 'ASC'], // Trier par l'ID des Pokémon en ordre decroissant
        ['pokemons', 'id', 'ASC'], // Trier par l'ID des Types en ordre decroissant
      ],
    });

    console.log(updatedteam);
    console.log(`Pokemon ${pokemon.name} removed from team ${team.name}`);
    res.status(200).json(updatedteam);
  } catch (error) {
    console.error('Error removing Pokemon from team:', error);
  }
}

export async function patchTeam(req, res) {
  try {
    const teamId = req.params.id;

    console.log(teamId);

    const { name } = req.body;

    // Recuperer la Task à modier par son id
    const team = await Team.findByPk(teamId);
    // console.log(task);
    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    // Editer la task
    const patchedTeam = await team.update({
      name: name || team.name,
    });

    // Renvoyer la tâche créée au format JSON
    console.log(`${team.name} team renamed to team ${patchedTeam.name}`);
    res.json(patchedTeam);
  } catch (error) {
    console.error('Error patching team:', error);
  }
}

export async function createTeam(req, res) {
  try {
    const userId = req.user.userId;

    const createdTeam = await Team.create({
      name: 'New Team',
      description: '',
      userId: userId,
    });

    console.log('New Team created');
    res.json(createdTeam);
  } catch (error) {
    console.error('Error creating team:', error);
  }
}

export async function deleteTeam(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const teamId = req.params.id;

    const team = await Team.findByPk(teamId, { transaction });

    if (!team) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Team not found.' });
    }

    // Supprimer les relations dans pokemon
    await team.setPokemons([], { transaction });

    // Supprimer l'équipe
    await team.destroy({ transaction });

    await transaction.commit();
    console.log(`${team.name} deleted`);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting team:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the team.' });
  }
}
