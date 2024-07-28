import { IType } from '../../@types/type';
import Type from './Type/Type';

interface TypesProps {
  types: IType[];
}

function Types({ types }: TypesProps) {
  return (
    <div className="container my-5">
      <div className="buttons notification is-centered" id="types-container">
        {types.map((type) => {
          return <Type type={type} key={type.id} />;
        })}
      </div>
    </div>
  );
}

export default Types;
