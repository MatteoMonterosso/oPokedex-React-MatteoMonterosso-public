import { ITeam } from '../../../@types/team';

interface TeamProps {
  team: ITeam;
  displayTeamModal: (teamId: number) => void;
}

function Team({ team, displayTeamModal }: TeamProps) {
  return (
    <div
      className="card m-3 is-clickable"
      onClick={() => {
        displayTeamModal(team.id);
      }}
      style={{ width: '20%', minWidth: '15em' }}
      key={team.id}
    >
      <div className="card-image m-3">
        <h3>{team.name}</h3>
        <div className="is-flex is-justify-content-space-evenly is-align-content-flex-start is-flex-wrap-wrap">
          {team.pokemons.map((pkm) => {
            return (
              <figure key={pkm.id} className="image is-square is-64x64 m-1">
                <img src={`/img/${pkm.id}.webp`} alt="Placeholder image" />
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Team;
