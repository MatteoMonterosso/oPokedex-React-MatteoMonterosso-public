export interface IPokemon {
  id: number;
  name: string;
  hp: number;
  atk: number;
  def: number;
  atk_spe: number;
  def_spe: number;
  speed: number;
  types: Type[];
}

export interface Type {
  id: number;
  name: string;
  color: string;
  pokemon_type: PokemonType;
}

export interface PokemonType {
  pokemon_id: number;
  type_id: number;
}
