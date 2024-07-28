import { useContext } from 'react';
import { IType } from '../../../@types/type';
import { IContext } from '../../../@types/context';
import Context from '../../../context/context';

interface TypeProps {
  type: IType;
}

function Type({ type }: TypeProps) {
  const { selectedTypesId, setSelectedTypesId } = useContext(
    Context
  ) as IContext;
  return (
    <button
      onClick={() => {
        // console.log(type.id);
        // console.log(selectedTypesId.includes(type.id));

        if (selectedTypesId.includes(type.id)) {
          const newSelectedTypesId = selectedTypesId.filter(
            (id) => id !== type.id
          );
          setSelectedTypesId(newSelectedTypesId);
        } else {
          const newSelectedTypesId = [...selectedTypesId, type.id];
          setSelectedTypesId(newSelectedTypesId);
        }
      }}
      className={`button is-hoverable ${selectedTypesId.includes(type.id) ? 'is-focused' : ''} is-flex is-flex-direction-column`}
    >
      <figure className="image is-64x64 mb-1">
        <img className="is-rounded" src={`/img/t${type.id}.png`} />
      </figure>
      <span>{type.name}</span>
    </button>
  );
}

export default Type;
