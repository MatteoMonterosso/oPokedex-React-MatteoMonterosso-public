import { IPokemon } from './pokemon';
import { ITeam } from './team';
import { IType } from './type';

export interface IContext {
  pkms: IPokemon[];
  teams: ITeam[];
  setTeams: React.Dispatch<React.SetStateAction<ITeam[]>>;
  token: string | null;
  expiredTokenProtocol: () => JSX.Element;
  selectedTypesId: number[];
  setSelectedTypesId: React.Dispatch<React.SetStateAction<number[]>>;
}
