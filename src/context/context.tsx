import { createContext } from 'react';
import { IContext } from '../@types/context';

const Context = createContext<null | IContext>(null);

export default Context;
