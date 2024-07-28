import { useContext, useState } from 'react';
import Team from './Team/Team';
import { ITeam } from '../../@types/team';
import TeamModal from '../TeamModal/TeamModal';
import Context from '../../context/context';
import { IContext } from '../../@types/context';
import axios, { AxiosError } from 'axios';

function Teams() {
  // const [teams, setTeams] = useState<ITeam[]>([]);

  const { teams, expiredTokenProtocol, token, setTeams, BackURL } = useContext(
    Context
  ) as IContext;

  console.log(teams);

  const [teamModalData, setTeamModalData] = useState<null | ITeam>(null);

  const displayTeamModal = (teamId: number) => {
    console.log(teamId);

    const teamData = teams.find((team) => {
      console.log(team.id);
      return team.id === teamId;
    });

    const newTeamModalData = teamData as ITeam;

    console.log(newTeamModalData);

    setTeamModalData(newTeamModalData);
  };

  const createNewTeam = async () => {
    try {
      const response = await axios.post(
        `${BackURL}/api/teams`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      const newTeam = response.data;
      newTeam.pokemons = [];

      console.log([...teams, newTeam]);

      setTeams([...teams, newTeam]);
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
    <>
      <div className="m-5 is-flex is-flex-wrap-wrap">
        {teams.map((team) => {
          return (
            <Team
              team={team}
              key={team.id}
              displayTeamModal={displayTeamModal}
            />
          );
        })}
        <div
          className="card m-3 is-clickable is-flex is-flex-direction-column is-justify-content-flex-start"
          onClick={() => {
            createNewTeam();
          }}
          style={{ width: '20%', minWidth: '15em' }}
        >
          <div className="card-image m-3 has-text-centered">
            <h3>CREATE NEW TEAM</h3>
          </div>

          <i className="fa-solid fa-plus m-auto"></i>
        </div>
      </div>
      {teamModalData && (
        <TeamModal
          teamModalData={teamModalData}
          setTeamModalData={setTeamModalData}
        />
      )}
    </>
  );
}

export default Teams;
