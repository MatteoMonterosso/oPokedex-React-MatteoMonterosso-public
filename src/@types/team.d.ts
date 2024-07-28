import { IPokemon } from './pokemon';

export interface ITeam {
  id: number;
  name: string;
  description: string;
  userId: number;
  pokemons: IPokemon[];
}
