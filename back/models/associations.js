import { Pokemon } from './Pokemon.js';
import { Type } from './Type.js';
import { Team } from './Team.js';
import { User } from './User.js';

// Pokemon <-> Type
Pokemon.belongsToMany(Type, {
  through: 'pokemon_type',
  as: 'types',
  foreignKey: 'pokemon_id',
  onDelete: 'CASCADE',
});
Type.belongsToMany(Pokemon, {
  through: 'pokemon_type',
  as: 'pokemons',
  foreignKey: 'type_id',
  onDelete: 'CASCADE',
});

// Pokemon <-> Team
Pokemon.belongsToMany(Team, {
  through: 'team_pokemon',
  as: 'teams',
  foreignKey: 'pokemon_id',
  onDelete: 'CASCADE',
});
Team.belongsToMany(Pokemon, {
  through: 'team_pokemon',
  as: 'pokemons',
  foreignKey: 'team_id',
  onDelete: 'CASCADE',
});

//User <-> Team
User.hasMany(Team, {
  foreignKey: 'userId',
  as: 'teams',
  onDelete: 'CASCADE',
});
Team.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
});

// Ré-exporter nos modèles
export { Pokemon, Type, Team, User };
