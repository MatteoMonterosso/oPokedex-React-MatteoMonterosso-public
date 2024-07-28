import { useContext } from 'react';
import { IPokemon } from '../../@types/pokemon';
import Pokemon from './Pokemon/Pokemon';
import Context from '../../context/context';
import { IContext } from '../../@types/context';

interface PokemonsProps {
  pkms: IPokemon[];
  displayPkmModal: (pkmId: number) => void;
}

function Pokemons({ pkms, displayPkmModal }: PokemonsProps) {
  const { selectedTypesId } = useContext(Context) as IContext;
  {
    console.log(selectedTypesId);
  }

  return (
    <div className="container is-fluid mt-3">
      <div
        className="notification is-flex is-flex-wrap-wrap is-justify-content-center is-align-content-flex-start"
        id="pkm-card-container"
      >
        {pkms.map((pkm) => {
          // console.log(pkm.types);
          const pkmTypes = pkm.types.map((type) => {
            return type.id;
          });

          if (pkmTypes.some((id) => selectedTypesId.includes(id))) {
            return (
              <Pokemon
                pkm={pkm}
                displayPkmModal={displayPkmModal}
                key={pkm.id}
              />
            );
          } else if (selectedTypesId.length === 0) {
            return (
              <Pokemon
                pkm={pkm}
                displayPkmModal={displayPkmModal}
                key={pkm.id}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default Pokemons;
