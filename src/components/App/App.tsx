import { ReactNode, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Header from '../Header/Header';
import Types from '../Types/Types';
import { IType } from '../../@types/type';
import Pokemons from '../Pokemons/Pokemons';
import PokemonModal from '../PokemonModal/PokemonModal';
import { IPokemon } from '../../@types/pokemon';
import Teams from '../Teams/Teams';
import {
  getTokenAndPseudoInLocalStorage,
  removeTokenAndPseudoFromLocalStorage,
} from '../../localStorage/localStorage';
import Context from '../../context/context';
import { ITeam } from '../../@types/team';
import * as bulmaToast from 'bulma-toast';
// import './App.css';

const BackURL = 'https://back-opokedex-react-matteomonterosso.onrender.com';

function App() {
  // STATE pour le pseudo
  const [pseudo, setPseudo] = useState<null | string>(null);

  // STATE pour le JWT
  const [token, setToken] = useState<null | string>(null);

  // STATE pour stocker les data des types
  const [types, setTypes] = useState<IType[]>([]);

  const [selectedTypesId, setSelectedTypesId] = useState<number[]>([]);

  // STATE pour stocker les data des pokemons
  const [pkms, setPkms] = useState<IPokemon[]>([]);

  const [teams, setTeams] = useState<ITeam[]>([]);

  // STATE pour stocker l'etat de loading de données
  const [isLoading, setIsLoading] = useState(true);

  const expiredTokenProtocol = () => {
    setPseudo(null);
    setToken(null);
    removeTokenAndPseudoFromLocalStorage();

    return (
      <>
        <Navigate to="/" />
        {
          bulmaToast.toast({
            message: 'Connexion expirée' as string,
            type: 'is-danger',
            dismissible: true,
            pauseOnHover: true,
            duration: 2000,
            position: 'top-right',
            extraClasses: 'toast',
            single: true,
          }) as ReactNode
        }
      </>
    );
  };

  // au rendu de la page, on va chercher dans le localStorage si y'a un token et un pseudo on les placent dans le state
  useEffect(() => {
    const tokenAndPseudo = getTokenAndPseudoInLocalStorage();

    if (tokenAndPseudo) {
      setPseudo(tokenAndPseudo.pseudo);
      setToken(tokenAndPseudo.token);
    }
  }, []);

  useEffect(() => {
    const fetchAndSaveTypes = async () => {
      try {
        const response = await axios.get(`${BackURL}/api/types`);

        setTypes(response.data);
        console.log(types);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAndSavePkms = async () => {
      try {
        const response = await axios.get(`${BackURL}/api/pokemons`);

        setPkms(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAndSaveTypes();
    console.log(types);

    fetchAndSavePkms();
    console.log(pkms);
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${BackURL}/api/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data);
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
    token && fetchTeams();
    setIsLoading(false);
  }, [token]);

  const [pkmModalData, setPkmModalData] = useState<null | IPokemon>(null);

  const displayPkmModal = (pkmId: number) => {
    console.log(pkmId);

    const pkmData = pkms.find((pkm) => {
      console.log(pkm.id);
      return pkm.id === pkmId;
    });

    const newPkmModalData = pkmData as IPokemon;

    console.log(newPkmModalData);

    setPkmModalData(newPkmModalData);
  };

  return (
    <>
      <Context.Provider
        value={{
          pkms,
          teams,
          setTeams,
          token,
          expiredTokenProtocol,
          selectedTypesId,
          setSelectedTypesId,
          BackURL,
        }}
      >
        <Header
          pseudo={pseudo}
          setPseudo={setPseudo}
          setToken={setToken}
          // fetchTeams={fetchTeams}
        />
        {isLoading ? (
          <progress className="progress is-small is-primary" max="100">
            15%
          </progress>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <main>
                  <Types types={types} />
                  <Pokemons pkms={pkms} displayPkmModal={displayPkmModal} />
                  {pkmModalData && (
                    <PokemonModal
                      pkmModalData={pkmModalData}
                      setPkmModalData={setPkmModalData}
                    />
                  )}
                </main>
              }
            />
            {token && <Route path="/teams" element={<Teams />} />}

            <Route path="*" element={<p>Erreur</p>} />
          </Routes>
        )}
      </Context.Provider>
    </>
  );
}

export default App;
