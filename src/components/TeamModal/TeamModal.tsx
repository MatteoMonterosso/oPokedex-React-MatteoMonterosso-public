import { useContext, useState } from 'react';
import { ITeam } from '../../@types/team';
import Context from '../../context/context';
import { IPokemon } from '../../@types/pokemon';
import axios, { AxiosError } from 'axios';
import { IContext } from '../../@types/context';

interface TeamModalProps {
  teamModalData: ITeam;
  setTeamModalData: React.Dispatch<React.SetStateAction<ITeam | null>>;
}

function TeamModal({ teamModalData, setTeamModalData }: TeamModalProps) {
  const { pkms, teams, setTeams, expiredTokenProtocol, token } = useContext(
    Context
  ) as IContext;

  const [inputValue, setInputValue] = useState('');

  const deletePkmFromTable = async (teamId: number, pkmId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/teams/${teamId}/pokemons/${pkmId}`,
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
      setTeamModalData(response.data);
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

  const patchTeamName = async (newName: string, teamId: number) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/teams/${teamId}`,
        {
          name: newName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      const updatedTeam = response.data;

      const updatedTeams = teams.map((team) => {
        if (updatedTeam.id === team.id) {
          return { ...team, name: updatedTeam.name };
        }
      });

      console.log(updatedTeams);

      setTeams(updatedTeams as ITeam[]);

      setTeamModalData({ ...teamModalData, name: updatedTeam.name });

      setInputValue('');
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

  const deleteTeam = async (teamId: number) => {
    console.log('joue');
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/teams/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      const updatedTeams = teams.filter((team) => {
        return team.id !== teamId;
      });

      setTeams(updatedTeams);
      setTeamModalData(null);
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
    <div className="modal is-active" id="team-modal">
      <div
        onClick={() => {
          setTeamModalData(null);
        }}
        className="modal-background is-clickable close"
      ></div>
      <div className="modal-card" style={{ width: 'auto' }}>
        <header className="modal-card-head is-flex is-justify-content-space-between">
          <div className="is-flex">
            <h2 className="modal-card-title mr-3">{teamModalData.name}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const form = e.currentTarget;
                const formData = new FormData(form);
                const newName = formData.get('new-name') as string;
                const teamId = teamModalData.id as number;

                console.log(newName);
                console.log(teamId);

                patchTeamName(newName, teamId);
              }}
              className="team__edit-form is-flex"
            >
              <input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                className="input is-small team__input-name"
                name="new-name"
                type="text"
                placeholder="New team name"
              />
              <button className="button is-link is-small team__button-edit">
                Edit
              </button>
            </form>
          </div>
          <button
            onClick={() => {
              setTeamModalData(null);
            }}
            className="delete close"
            aria-label="close"
          ></button>
        </header>
        <section
          className="is-flex modal-card-body is-flex-wrap-wrap"
          id="team-card-container"
        >
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>HP</th>
                <th>ATK</th>
                <th>DEF</th>
                <th>ATK SPE</th>
                <th>DEF SPE</th>
                <th>SPEED</th>
                <th>TYPES</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="row-pkm-detail-team">
              {/* <!-- Insert row detail pkm template --> */}
              {teamModalData.pokemons.map((teamPkm) => {
                // console.log(pkms);

                const pkm = pkms.find((elem) => {
                  return teamPkm.id === elem.id;
                }) as IPokemon;

                return (
                  <tr key={pkm.id}>
                    <th slot="pkm-id">{pkm.id}</th>
                    <td slot="pkm-name">{pkm.name}</td>
                    <td slot="pkm-hp">{pkm.hp}</td>
                    <td slot="pkm-atk">{pkm.atk}</td>
                    <td slot="pkm-def">{pkm.def}</td>
                    <td slot="pkm-atk_spe">{pkm.atk_spe}</td>
                    <td slot="pkm-def_spe">{pkm.def_spe}</td>
                    <td slot="pkm-speed">{pkm.speed}</td>
                    <td>
                      <div className="field is-grouped is-grouped-multiline">
                        <div className="control">
                          <div
                            className="tags has-addons"
                            slot="types-container"
                          >
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
                            {/* <!-- Inserer le ou les types --> */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <i
                        onClick={async () => {
                          await deletePkmFromTable(teamModalData.id, pkm.id);
                        }}
                        className="fa-solid fa-trash is-clickable"
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <button
              onClick={() => {
                deleteTeam(teamModalData.id);
              }}
              className="button is-danger"
            >
              Delete Team
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default TeamModal;
