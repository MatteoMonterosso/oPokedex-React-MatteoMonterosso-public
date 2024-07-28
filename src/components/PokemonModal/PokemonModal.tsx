import { ReactNode, useContext } from 'react';
import { IPokemon } from '../../@types/pokemon';
import { IContext } from '../../@types/context';
import * as bulmaToast from 'bulma-toast';
import Context from '../../context/context';
import axios, { AxiosError } from 'axios';
import { ITeam } from '../../@types/team';

interface PokemonModalProps {
  pkmModalData: IPokemon;
  setPkmModalData: React.Dispatch<React.SetStateAction<IPokemon | null>>;
}

function PokemonModal({ pkmModalData, setPkmModalData }: PokemonModalProps) {
  const { pkms, teams, setTeams, token, expiredTokenProtocol, BackURL } =
    useContext(Context) as IContext;

  const addPkmToTeam = async (teamId: number, pkmId: number) => {
    try {
      console.log(token);
      const response = await axios.put(
        `${BackURL}/api/teams/${teamId}/pokemons/${pkmId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      const updatedTeam = response.data;

      const updatedTeams = teams.map((team) => {
        return updatedTeam.id === team.id && updatedTeam;
      });

      setTeams(updatedTeams);

      const pkm = pkms.find((pkm) => {
        return pkm.id === pkmId;
      }) as IPokemon;
      const pkmName = pkm.name;

      const team = teams.find((team) => {
        return team.id === teamId;
      }) as ITeam;
      const teamName = team.name;

      bulmaToast.toast({
        message: `${pkmName} à bien été ajouté à la Team ${teamName}` as string,
        type: 'is-primary',
        dismissible: true,
        pauseOnHover: true,
        duration: 4000,
        position: 'top-right',
        extraClasses: 'toast',
        single: true,
      }) as ReactNode;
    } catch (error) {
      console.log(error);
      if (
        error instanceof AxiosError &&
        error?.response?.data.error === 'Token has expired'
      ) {
        expiredTokenProtocol();
      }
    }
  };

  return (
    <div className={`modal is-active`} id="pkm-modal">
      <div
        onClick={() => {
          setPkmModalData(null);
        }}
        className="modal-background is-clickable"
      ></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <h2 className="modal-card-title">Caractéristiques</h2>
          <button
            onClick={() => {
              setPkmModalData(null);
            }}
            className="delete"
            aria-label="close"
          ></button>
        </header>
        <section className="modal-card-body">
          {/* <!-- Content ... --> */}
          <div className="columns">
            <div className="column">
              <figure className="image mb-3">
                <img src={`/img/${pkmModalData.id}.webp`} />
              </figure>
              <div className="is-flex is-justify-content-space-between">
                <h3 className="block is-centered" slot="pkm-name">
                  {pkmModalData.name}
                </h3>
                <span slot="pkm-id">{`#${pkmModalData.id}`}</span>
              </div>

              <div className="field is-grouped is-grouped-multiline">
                <div className="control">
                  <div className="tags has-addons" slot="types-container">
                    {pkmModalData.types.map((type) => {
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

            <div className="column container" style={{ height: 'auto' }}>
              <div
                className="notification is-flex is-flex-direction-column is-justify-content-space-around"
                style={{ height: '100%' }}
              >
                <span>
                  <strong>HP : </strong> {pkmModalData.hp}
                </span>
                <span>
                  <strong>ATK : </strong>
                  {pkmModalData.atk}
                </span>
                <span>
                  <strong>DEF : </strong>
                  {pkmModalData.def}
                </span>
                <span>
                  <strong>ATK SPE : </strong>
                  {pkmModalData.atk_spe}
                </span>
                <span>
                  <strong>DEF SPE : </strong>
                  {pkmModalData.def_spe}
                </span>
                <span>
                  <strong>SPEED : </strong>
                  {pkmModalData.speed}
                </span>
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.currentTarget;
              const formData = new FormData(form);
              const targetedTeam = parseInt(
                formData.get('team-to-edit') as string
              ) as number;
              const pkmIdToAdd = pkmModalData.id as number;

              console.log(targetedTeam);
              console.log(pkmIdToAdd);

              addPkmToTeam(targetedTeam, pkmIdToAdd);
            }}
            action=""
          >
            <div className="field has-addons">
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select name="team-to-edit">
                    <option value="">Select a team</option>;
                    {teams.map((team) => {
                      return (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="control">
                <button type="submit" className="button is-primary">
                  Choose
                </button>
              </div>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default PokemonModal;
