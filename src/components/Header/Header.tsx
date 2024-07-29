import axios from 'axios';
import * as bulmaToast from 'bulma-toast';
import { ReactNode, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  removeTokenAndPseudoFromLocalStorage,
  setTokenAndPseudoToLocalStorage,
} from '../../localStorage/localStorage';
import Context from '../../context/context';
import { IContext } from '../../@types/context';

interface HeaderProps {
  pseudo: string | null;
  setPseudo: React.Dispatch<React.SetStateAction<string | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  // fetchTeams: () => Promise<void>;
}
// { pseudo, setPseudo, setToken }: HeaderProps

function Header({ pseudo, setPseudo, setToken }: HeaderProps) {
  const { BackURL } = useContext(Context) as IContext;

  const [burgerButton, setBurgerButton] = useState(false);

  const checkCredentials = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BackURL}/api/login`, {
        email: email,
        password: password,
      });

      // si j'ai une reponse ok je veux afficher le pseudo dans la page

      // si on reçoit une 200 on enregistre le pseudo reçu dans le state
      setPseudo(response.data.pseudo);
      setToken(response.data.token);

      // on enregistre le token et le pseudo dans le localStorage
      setTokenAndPseudoToLocalStorage(
        response.data.token,
        response.data.pseudo
      );

      console.log(response);

      bulmaToast.toast({
        message: `Bonjour ${response.data.pseudo} !` as string,
        type: 'is-primary',
        dismissible: true,
        pauseOnHover: true,
        duration: 4000,
        position: 'top-right',
        extraClasses: 'toast',
        single: true,
      }) as ReactNode;
    } catch (error) {
      bulmaToast.toast({
        message: 'Erreur de connexion' as string,
        type: 'is-danger',
        dismissible: true,
        pauseOnHover: true,
        duration: 2000,
        position: 'top-right',
        extraClasses: 'toast',
        single: true,
      }) as ReactNode;
    }
  };

  return (
    <header>
      <nav
        className="navbar has-background-primary-dark"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand is-primary-dark">
          <h1>
            <Link className="navbar-item" to="/">
              <p className="is-size-2 has-text-weight-semibold">o'Pokedex</p>
            </Link>
          </h1>

          <a
            onClick={() => {
              setBurgerButton(!burgerButton);
            }}
            role="button"
            className={`navbar-burger ${burgerButton && 'is-active'}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarBasicExample"
          className={`navbar-menu ${burgerButton && 'is-active'}`}
        >
          <div className="navbar-start">
            <Link to="/" className="navbar-item">
              Pokemons
            </Link>

            {pseudo && (
              <Link to="/teams" className="navbar-item" id="team-button">
                Mes Teams
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {pseudo ? (
              <>
                <div>{pseudo}</div>
                <Link
                  to="/"
                  onClick={() => {
                    // on est deconnecté si le peudo est null
                    setPseudo(null);
                    setToken(null);

                    // on vide le localStorage
                    removeTokenAndPseudoFromLocalStorage();
                  }}
                  className="button is-danger"
                >
                  Déconnexion
                </Link>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const email = formData.get('email') as string;
                  const password = formData.get('password') as string;

                  console.log(email);
                  console.log(password);

                  checkCredentials(email, password);
                }}
                className="control is-flex"
              >
                <input
                  className="input"
                  type="text"
                  placeholder="email"
                  name="email"
                />
                <input
                  className="input"
                  type="password"
                  placeholder="password"
                  name="password"
                />
                <button className="button is-primary">Se connecter</button>
              </form>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
