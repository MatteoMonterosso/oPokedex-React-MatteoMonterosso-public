import { IPokemon } from '../../../@types/pokemon';

interface PokemonProps {
  pkm: IPokemon;
  displayPkmModal: (pkmId: number) => void;
}

function Pokemon({ pkm, displayPkmModal }: PokemonProps) {
  return (
    <div className="card m-3" style={{ minWidth: '15em' }}>
      <div
        onClick={() => {
          console.log(pkm.id);
          displayPkmModal(pkm.id);
        }}
        className="card-image m-3 is-clickable"
      >
        <figure className="image is-square m-4">
          <img src={`/img/${pkm.id}.webp`} alt={pkm.name} />
        </figure>
      </div>
      <div className="card-content">
        <div className="is-flex is-justify-content-space-between">
          <h3 className="block is-centered">{pkm.name}</h3>
          <span>{`#${pkm.id}`}</span>
        </div>

        <div className="is-flex is-justify-content-space-between is-align-content-center">
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <div className="tags has-addons">
                {pkm.types.map((type) => {
                  return (
                    <span
                      className="tag is-primary"
                      style={{ backgroundColor: `#${type.color}` }}
                      key={type.id}
                    >
                      {type.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pokemon;
