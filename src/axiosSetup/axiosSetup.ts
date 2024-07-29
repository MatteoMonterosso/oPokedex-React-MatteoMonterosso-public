import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://back-opokedex-react-matteomonterosso.onrender.com/api',
});

export default instance;
