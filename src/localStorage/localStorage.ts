// fonction qui enregistre le token en localstorage
export const setTokenAndPseudoToLocalStorage = (
  token: string,
  pseudo: string
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("pseudo", pseudo);
};

// fonction qui recupère le token depuis le localStorage si y'en a un
export const getTokenAndPseudoInLocalStorage = () => {
  const token = localStorage.getItem("token");
  const pseudo = localStorage.getItem("pseudo");

  // si y'a pas de token on renvoie null
  if (!token) {
    return null;
  }

  // sinon on renvoi les infos
  return {
    token,
    pseudo,
  };
};

// fonction qui supprime les infos en cas de deconnexion
export const removeTokenAndPseudoFromLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("pseudo");
};
